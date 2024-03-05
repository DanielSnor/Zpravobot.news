#!/bin/bash

# Colors
red='\033[0;31m'
green='\033[0;32m'
blue='\033[0;34m'
reset='\033[0m'


# Missing argument show help
if [ "$#" -eq 0 ]; then
    echo "Script for creating Zpravobot code for IFTTT applet."
    echo
    echo -e "Usage: ${blue}$0 <source> [...<system>]${reset}"
    echo
    echo "arguments:"
    echo -e "  ${blue}<source>${reset}    Part name of builder-<source>.ts file. Can be multiple separed by space."
    exit 0
fi

baseBuilder="builder.ts"

if [ ! -e "$baseBuilder" ]; then
    echo -e "${red}ERROR: Missing file $baseBuilder!${reset}"
    exit 1
fi

baseCode=$(<"$baseBuilder")

mainFile="main.ts"

if [ ! -e "$mainFile" ]; then
    echo -e "${red}ERROR: Missing file $mainFile!${reset}"
    exit 1
fi

mainCode=$(<"$mainFile")

# Development code markers whose content will be replaced
markerStart="///"
markerEnd="///DEV"

for source in "$@"; do
    sourceBuilder="builder-$source.ts"

    if [ ! -e "$sourceBuilder" ]; then
        echo -e "${red}ERROR: Missing file $sourceBuilder!${reset}"
        continue
    fi

    sourceCode=$(<"$sourceBuilder")
    codeBefore="${sourceCode%%$markerStart*}"
    codeAfter="${sourceCode##*$markerEnd}"

    # Replacing development code with base builder code
    sourceCode="$codeBefore $baseCode $codeAfter"

    codeBefore="${mainCode%%$markerStart*}"
    codeAfter="${mainCode##*$markerEnd}"

    # Replacing developer code with builder code
    finalCode="$codeBefore $sourceCode $codeAfter"

    if [ "$#" -eq 1 ]; then
        # For one system, the code is copied to the clipboard
        echo -n "$finalCode" | pbcopy
    else
        # Separate code files are created for multiple systems
        timeSuffix=$(date +"%Y-%m-%d_%H-%M")
        outputFile="_${system}_${timeSuffix}.ts"
        echo -n "$finalCode" > "$outputFile"
        echo -e "Created ${green}$outputFile${reset}"
    fi
done
