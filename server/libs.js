require('dotenv').config()
const mysql = require('mysql2/promise')
const crypto = require('crypto')


/**
 * Stops the script from running
 */
const stop = {
    /**
     * @param {string} message
     */
    success: (message) => {
        console.log(message)
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
 * @param {boolean} required Default TRUE
 * @returns {boolean|number|string|null}
 * @throws Will throw an error if the env variable is required and missing.
 */
function env(name, required = true) {
    if (!Object.hasOwn(process.env, name)) {
        if (required) throw new Error(`Missing env ${name}`)
        return null
    }

    const value = process.env[name]

    switch (true) {
        case ['yes', 'true', 'no', 'false'].includes(value):
            return ['yes', 'true'].includes(value)
        case value.split('.').length > 2:
            return value
        case !isNaN(parseInt(value)):
            return parseInt(value)
        case !isNaN(parseFloat(value)):
            return parseFloat(value)
        default:
            return value
    }
}


class Settings {
    static AmpersantReplacement = env('AMPERSANT_REPLACEMENT', false)
    static MaxPostLength = env('MAX_POST_LENGTH')
    static RepostAllowed = env('REPORT_ALLOWED', false)
    static ShouldPreferRealName = env('SHOULD_PREFER_REAL_NAME')
    static ShowFeedUrlInsteadPostUrl = env('SHOW_FEED_URL_INSTEAD_POST_URL')
    static ShowImageUrl = env('SHOW_IMAGE_URL')
    static ShowStatusUrlPerm = env('SHOW_STATUR_URL_PERM')
    static StatusUrlSentence = env('STATUS_URL_SENTENCE', false)
    static StatusImageUrlSentence = env('STATUS_IMAGE_URL_SENTENCE', false)
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
        try {
            await this.connect()

            const [result] = await this._connection.execute(sql, values)

            return result
        } catch (err) {
            console.error({ sql, values })
            throw err
        }
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
            let i = ULID.RandomLength - 1
            while (i >= 0 && this._lastRandChars[i] === ULID.EncodingChars.length - 1) {
                this._lastRandChars[i] = 0
                i--
            }
            this._lastRandChars[i]++
        }

        const randChars = this._lastRandChars.map(randCharIndex => ULID.EncodingChars[randCharIndex]).join('')

        return `${timeChars}${randChars}`
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
        console.log(status); return;
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
    static Table = 'posts'
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
        if (guids.length === 0) return []

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

class Feed {
    /** @type {string} */
    link
    /** @type {string} */
    title
    /** @type {string|null} */
    image
}
class Entry {
    /** @type {string} */
    guid
    /** @type {string} */
    link
    /** @type {string} */
    title
    /** @type {string} */
    creator
    /** @type {string} */
    content
    /** @type {string|null} */
    image
}
class Post {
    /** @type {Feed} */
    feed
    /** @type {Entry} */
    entry
}


class Validator {
    static containsUrl(str) {
        return new RegExp('https?://', 'i').test(str)
    }
}


class Middlewares {
    /**
     * @param {string} str
     * @returns {string}
     */
    static trim(str, maxLength) {
        if (str.substring(str.length - 2) === ' …') {
            str = str.substring(0, str.length - 1) + '[…]'
        } else if (str.substring(str.length - 1) === '…') {
            const lastSpace = str.lastIndexOf(' ')
            str = str.substring(0, lastSpace) + ' […]'
        }

        return str.length <= maxLength
            ? str
            : Middlewares.trim(str.substring(0, maxLength - 1).trim())
    }

    /**
     * @param {string} str
     * @returns {string}
     */
    static removeHtml(str) {
        return str.replace(/<[^<>]+>/g, '')
    }

    /**
     * Replacing the substring specified by the key with a string in value
     * @param {string} str
     * @param {Object.<string, string>} replacements
     * @param {boolean} [caseSensitive=false]
     * @returns {string}
     */
    static replaceAll(str, replacements, caseSensitive = false) {
        for (const find in replacements) {
            const regex = new RegExp(find, caseSensitive ? 'g' : 'ig')
            const replaceValue = replacements[find]
            str = str.replace(regex, replaceValue)
        }

        return str
    }

    /**
     * @param {string} str
     * @returns {string}
     */
    static replaceAmpersands(str) {
        return str
            .split(' ')
            .map(word => Validator.containsUrl(word)
                ? encodeURI(word).replace(/\&amp;/g, '%26').replace(/\&/g, '%26')
                : Middlewares.replaceAll(word, {
                    '&amp;': Settings.AmpersantReplacement,
                    '&#38;': Settings.AmpersantReplacement,
                    '&#038;': Settings.AmpersantReplacement,
                    '&': Settings.AmpersantReplacement,
                })
            )
            .join(' ')
    }

    /**
     * @param {string} str
     * @returns {string}
     */
    static replaceBasicFormatting(str) {
        return Middlewares
            .replaceAll(str, {
                '<br>': '\n',
                '</p>': '\n',
            })
            .replace(/\n{2,}/g, '\n')
            .replace(/ {2,}/g, ' ')
    }

    /**
     * @param {string} str
     * @returns {string}
     */
    static replaceCzechCharacters(str) {
        return Middlewares.replaceAll(str, {
            '&#193;': 'Á',
            '&Aacute;': 'Á',
            'A&#769;': 'Á',
            '&#196;': 'Ä',
            '&Auml;': 'Ä',
            'A&#776;': 'Ä',
            '&#201;': 'É',
            '&Eacute;': 'É',
            'E&#769;': 'É',
            '&#203;': 'Ë',
            '&Euml;': 'Ë',
            'E&#776;': 'Ë',
            '&#205;': 'Í',
            '&Lacute;': 'Í',
            'I&#769;': 'Í',
            '&#207;': 'Ï',
            '&Luml;': 'Ï',
            'I&#776;': 'Ï',
            '&#211;': 'Ó',
            '&Oacute;': 'Ó',
            'O&#769;': 'Ó',
            '&#214;': 'Ö',
            '&Ouml;': 'Ö',
            'O&#776;': 'Ö',
            '&#218;': 'Ú',
            '&Uacute;': 'Ú',
            'U&#769;': 'Ú',
            '&#220;': 'Ü',
            '&Uuml;': 'Ü',
            'U&#776;': 'Ü',
            '&#221;': 'Ý',
            '&Yacute;': 'Ý',
            'Y&#769;': 'Ý',
            '&#225;': 'á',
            '&aacute;': 'á',
            'a&#769;': 'á',
            '&#228;': 'ä',
            '&auml;': 'ä',
            'a&#776;': 'ä',
            '&#233;': 'é',
            '&eacute;': 'é',
            'e&#769;': 'é',
            '&#235;': 'ë',
            '&euml;': 'ë',
            'e&#776;': 'ë',
            '&#237;': 'í',
            '&iacute;': 'í',
            'i&#769;': 'í',
            '&#239;': 'ï',
            '&iuml;': 'ï',
            'i&#776;': 'ï',
            '&#243;': 'ó',
            '&oacute;': 'ó',
            'o&#769;': 'ó',
            '&#246;': 'ö',
            '&ouml;': 'ö',
            'o&#776;': 'ö',
            '&#250;': 'ú',
            '&uacute;': 'ú',
            'u&#769;': 'ú',
            '&#252;': 'ü',
            '&uuml;': 'ü',
            'u&#776;': 'ü',
            '&#253;': 'ý',
            '&yacute;': 'ý',
            'y&#769;': 'ý',
            '&#268;': 'Č',
            '&Ccaron;': 'Č',
            'C&#780;': 'Č',
            '&#269;': 'č',
            '&ccaron;': 'č',
            'c&#780;': 'č',
            '&#270;': 'Ď',
            '&Dcaron;': 'Ď',
            'D&#780;': 'Ď',
            '&#271;': 'ď',
            '&dcaron;': 'ď',
            'd&#780;': 'ď',
            '&#282;': 'Ě',
            '&Ecaron;': 'Ě',
            'E&#780;': 'Ě',
            '&#283;': 'ě',
            '&ecaron;': 'ě',
            'e&#780;': 'ě',
            '&#327;': 'Ň',
            '&Ncaron;': 'Ň',
            'N&#780;': 'Ň',
            '&#328;': 'ň',
            '&ncaron;': 'ň',
            'n&#780;': 'ň',
            '&#336;': 'Ő',
            '&Odblac;': 'Ő',
            'O&#778;': 'Ő',
            '&#337;': 'ő',
            '&odblac;': 'ő',
            'o&#778;': 'ő',
            '&#344;': 'Ř',
            '&Rcaron;': 'Ř',
            'R&#780;': 'Ř',
            '&#345;': 'ř',
            '&rcaron;': 'ř',
            'r&#780;': 'ř',
            '&#352;': 'Š',
            '&Scaron;': 'Š',
            'S&#780;': 'Š',
            '&#353;': 'š',
            '&scaron;': 'š',
            's&#780;': 'š',
            '&#356;': 'Ť',
            '&Tcaron;': 'Ť',
            'T&#780;': 'Ť',
            '&#357;': 'ť',
            '&tcaron;': 'ť',
            't&#780;': 'ť',
            '&#366;': 'Ů',
            '&Uring;': 'Ů',
            'U&#778;': 'Ů',
            '&#367;': 'ů',
            '&uring;': 'ů',
            'u&#778;': 'ů',
            '&#368;': 'Ű',
            '&Udblac;': 'Ű',
            'U&#369;': 'Ű',
            '&#369;': 'ű',
            '&udblac;': 'ű',
            'u&#369;': 'ű',
            '&#381;': 'Ž',
            '&Zcaron;': 'Ž',
            'Z&#780;': 'Ž',
            '&#382;': 'ž',
            '&zcaron;': 'ž',
            'z&#780;': 'ž',
        }, true)
    }

    /**
     * @param {string} str
     * @returns {string}
     */
    static replaceSpecialCharacters(str) {
        return Middlewares.replaceAll(str, {
            '&#09;': ' ',
            '&#009;': ' ',
            '&#10;': ' ',
            '&#010;': ' ',
            '&#13;': ' ',
            '&#013;': ' ',
            '&#32;': ' ',
            '&#032;': ' ',
            '&#33;': '!',
            '&#033;': '!',
            '&excl;': '!',
            '&#34;': '"',
            '&#034;': '"',
            '&quot;': '"',
            '&#37;': '%',
            '&#037;': '%',
            '&percnt;': '%',
            '&#39;': '‘',
            '&#039;': '‘',
            '&apos;': '‘',
            '&#40;': '(',
            '&#040;': '(',
            '&lpar;': '(',
            '&#41;': ')',
            '&#041;': ')',
            '&rpar;': ')',
            '&#46;': '.',
            '&#046;': '.',
            '&period;': '.',
            '&#60;': '<',
            '&#060;': '<',
            '&lt;': '<',
            '&#61;': '=',
            '&#061;': '=',
            '&equals;': '=',
            '&#62;': '>',
            '&#062;': '>',
            '&gt;': '>',
            '&#160;': ' ',
            '&nbsp;': ' ',
            '&#173;': '',
            '&#xAD;': '',
            '&shy;': '',
            '&#8192;': ' ',
            '&#8193;': ' ',
            '&#8194;': ' ',
            '&#8195;': ' ',
            '&#8196;': ' ',
            '&#8197;': ' ',
            '&#8198;': ' ',
            '&#8199;': ' ',
            '&#8200;': ' ',
            '&#8201;': ' ',
            '&#8202;': ' ',
            '&#8203;': ' ',
            '&#8204;': ' ',
            '&#8205;': ' ',
            '&#8206;': ' ',
            '&#8207;': ' ',
            '&#8208;': '-',
            '&#x2010;': '-',
            '&hyphen;': '-',
            '&#8209;': '-',
            '&#x2011;': '-',
            '&#8211;': '–',
            '&ndash;': '–',
            '&#8212;': '—',
            '&mdash;': '—',
            '&#8216;': '‘',
            '&lsquo;': '‘',
            '&#8217;': '’',
            '&rsquo;': '’',
            '&#8218;': '‚',
            '&sbquo;': '‚',
            '&#8219;': '‛',
            '&#8220;': '“',
            '&ldquo;': '“',
            '&#8221;': '”',
            '&rdquo;': '”',
            '&#8222;': '„',
            '&bdquo;': '„',
            '&#8223;': '‟',
            '&#8230;': '…',
            '&hellip;': '…',
            '&#8242;': '′',
            '&prime;': '′',
            '&#8243;': '″',
            '&Prime;': '″',
            '&#8722;': '-',
            '&minus;': '-',
        })
    }
}


module.exports = { stop, env, Mastodon, PostsRepository, Feed, Entry, Post, Validator, Middlewares, Settings }
