/**
 * Script for posting from RSS
 * Set the URL with the target RSS as env variable RSS_URL when run in the terminal
 * The necessary env variables are in .env.example
 */

require('dotenv').config()
const mysql = require('mysql2/promise')
const RssParser = require('rss-parser')
const crypto = require('crypto')


/**
 * Stops the script from running
 */
const stop = {
    /**
     * @param {string} message
     */
    success: (message) => {
        console.log(message);
        process.exit(0)
    },
    /**
     * @param {Error} error
     */
    failed: (error) => {
        console.error(error)
        process.exit(1)
    },
}


/**
 * Gets the env variable value of the specified name
 * @param {string} name
 * @returns {string}
 * @throws Will throw an error if the env variable is empty or missing.
 */
function env(name) {
    if (!Object.hasOwn(process.env, name)) throw new Error(`Missing env ${name}`)
    if (process.env[name] === '') throw new Error(`Empty env ${name}`)

    return process.env[name]
}


class DB {
    _connection = null
    _host
    _user
    _password
    _dbName

    constructor() {
        this._host = env('DB_HOST')
        this._user = env('DB_USER')
        this._password = env('DB_PASS')
        this._dbName = env('DB_NAME')
    }

    /**
     * Execute a SQL and returns rows for SELECT or ResultSetHeader for other queries
     * @param {string} sql
     * @param {any[]} values
     * @returns {Promise<{[key:string]: any}|import('mysql2').ResultSetHeader>}
     */
    async query(sql, values) {
        await this.connect()

        const [result] = await this._connection.execute(sql, values)

        return result
    }

    async disconnect() {
        if (this._connection) await this._connection.end()
    }

    async connect() {
        if (this._connection) return

        // https://sidorares.github.io/node-mysql2/docs/examples/connections/create-connection#connectionoptions
        this._connection = await mysql.createConnection({
            host: this._host,
            user: this._user,
            password: this._password,
            database: this._dbName,
        })
    }
}


/**
 * UUID analogy
 * Shorter, more secure, time-sortable
 */
class ULID {
    static EncodingChars = '0123456789abcdefghjkmnpqrstvwxyz'
    static TimeLength = 10
    static RandomLength = 16

    _lastGenTime = 0
    // maintains indexes for random string characters
    // can move characters by increasing the index
    _lastRandChars = []


    /**
     * Creates ULID
     * @returns {string}
     */
    generate() {
        let milliseconds = Date.now()
        const duplicateTime = milliseconds === this._lastGenTime

        this._lastGenTime = milliseconds

        let timeChars = ''

        // timestamp is encrypted from lowest to highest order
        // allows sorting by generation time
        for (let i = ULID.TimeLength - 1; i >= 0; i--) {
            // modulo magie
            const mod = milliseconds % ULID.EncodingChars.length
            timeChars = `${ULID.EncodingChars[mod]}${timeChars}`
            milliseconds = (milliseconds - mod) / ULID.EncodingChars.length
        }

        if (!duplicateTime) {
            // generates a random string for the suffix
            // ensures uniqueness for the same millisecond
            for (let i = 0; i < ULID.RandomLength; i++) {
                this._lastRandChars[i] = crypto.randomInt(0, ULID.EncodingChars.length - 1)
            }
        } else {
            // timestamp has not changed since last generation
            // uses the same random string incremented by 1
            for (let i = ULID.RandomLength - 1; i >= 0 && this._lastRandChars[i] === ULID.EncodingChars.length - 1; i--) {
                this._lastRandChars[i] = 0
            }

            this._lastRandChars[i]++
        }

        const randChars = this._lastRandChars.map(randCharIndex => ULID.EncodingChars[randCharIndex]).join('')

        return `${timeChars}${randChars}`
    }
}


class RssArticle {
    guid
    title
    link
    enclosure
    content
    isoDate

    static createFromItem(item) {
        const self = new RssArticle()

        for (const attr in item) {
            if (Object.hasOwn(self, attr)) self[attr] = item[attr]
        }

        return self
    }
}
class RSS {
    _url
    _parser

    constructor() {
        this._url = env('RSS_URL')
        this._parser = new RssParser()
    }

    async articles() {
        const feed = await this._parser.parseURL(this._url)

        return feed.items.map(RssArticle.createFromItem).slice(0, 3)
    }
}


class API {
    _baseURL
    _token

    constructor() {
        this._baseURL = env('MASTODON_API_URL')
        this._token = env('MASTODON_API_TOKEN')
    }

    async createPost(idempotencyKey, status) {
        return this._request('POST', '/statuses', status, {
            // https://docs.joinmastodon.org/methods/statuses/#headers
            'Idempotency-Key': idempotencyKey,
        })
    }

    async _request(method, endpont, body = undefined, headers = {}) {
        headers['Authorization'] = `Bearer ${this._token}`

        return fetch(`${this._baseURL}${endpont}`, { method, headers, body })
    }
}


class Mastodon {
    _api = new API()


    async newPost(guid, status) {
        // check against double sending
        // normalizes article ID
        const idempotencyKey = crypto.createHash('sha256').update(guid).digest('hex')

        const formData = new FormData()
        formData.append('status', status)

        const response = await this._api.createPost(idempotencyKey, formData)


        if (!response.ok) {
            // may be a bad URL, but also a duplicate post article
            if (response.status === 404) {
                const body = await response.json()
                // a duplicate post error corresponds to a non-existent post error
                if (Object.hasOwn(body, 'error') && body.error === 'Record not found') {
                    return null
                }
            }

            throw new Error(`Failed to post: [${response.status}] ${response.statusText}`)
        }

        return await response.json()
    }
}


class PostsRepository {
    static Table = '_posts'
    /*
        CREATE TABLE IF NOT EXISTS `posts` (
        `id` char(36) NOT NULL,
        `guid` varchar(1000)  NOT NULL,
        `guid_md5` char(32) AS (MD5(`guid`)) STORED,
        `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (`id`),
        INDEX guid_md5 (`guid_md5`),
        INDEX created (`created`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci
    */
    _db
    _ulid

    constructor() {
        this._db = new DB()
        this._ulid = new ULID()
    }

    /**
     * Filters the given GUIDs and returns only the unposted ones
     * @param {string[]} guids
     * @returns {Promise<string[]>}
     */
    async filterUnposted(guids) {
        const pls = this._placeholders('MD5(?)', guids.length)
        const rows = await this._db.query(`SELECT guid FROM ${this._quoteName(PostsRepository.Table)} WHERE guid_md5 IN (${pls})`, guids)
        const postedGuids = new Set(rows.map(row => row.guid))


        return guids.filter(guid => !postedGuids.has(guid))
    }

    /**
     * Saves the given GUIDs
     * @param {string[]} guids
     */
    async savePosted(guids) {
        if (guids.length === 0) return

        const pls = this._placeholders('(?,?)', guids.length)
        const values = []
        guids.map(guid => values.push(this._ulid.generate(), guid))

        await this._db.query(`INSERT INTO ${this._quoteName(PostsRepository.Table)} (id, guid) VALUES ${pls}`, values)
    }

    /**
     * Creates a string with placeholders according to the specified template with a coma as a separator
     * @param {string} template
     * @param {number} repeat
     * @returns {string}
     */
    _placeholders(template, repeat) {
        return new Array(repeat).fill(template).join(',')
    }

    /**
     * Wrap the name with the `
     * @param {string} name
     * @returns {string}
     */
    _quoteName(name) {
        return '`' + name + '`'
    }
}



const main = async () => {
    try {
        const rss = new RSS()
        const postsRepository = new PostsRepository()
        const mastodon = new Mastodon()

        const articles = await rss.articles()

        const unpostedGuids = await postsRepository.filterUnposted(articles.map(article => article.guid))
        const postedGuids = []

        // waits for all parallel requests to finish and for postedGuids to be filled
        await Promise.all(articles.map(art => unpostedGuids.includes(art.guid)
            ? mastodon.newPost(art.guid, `${art.title}\n${art.content}\n${art.link}`).then(post => post && postedGuids.push(art.guid))
            : Promise.resolve()
        ))

        await postsRepository.savePosted(postedGuids)
        stop.success(`Posted ${postedGuids.length} post${postedGuids.length > 1 ? 's' : ''}`)

    } catch (error) {
        stop.failed(error)
    }
}

main()
