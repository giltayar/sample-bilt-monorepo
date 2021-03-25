#!/usr/bin/env node
import {app} from './console-snake.js'

await app(process.argv.slice(2), {shouldExitOnError: true});
