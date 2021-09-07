#!/usr/bin/env node

import jsome from 'jsome';
import sade from 'sade';
import { existsSync } from 'fs';
import jsonfile from 'jsonfile';
import * as transform from './transform.js';
import { isNil } from 'ramda';
import j2jPkg from 'awesome-json2json';
import importTabs from './importTabs.js';

const { default: json2json } = j2jPkg;

sade('the-library [dir]', true)
  .version('1.0.0')
  .describe('Upload One Tab file to supabase')
  .option('-p, --parser', 'Choose tab file parser', 'oneTab')
  .option('--dry-run', 'Just do transform', false)
  .action(async (dir, opts) => {
    if (existsSync(dir)) {
      try {
        const tabsfile = jsonfile.readFileSync(dir);

        if (isNil(transform[opts.parser])) {
          throw new Error('No parser: ' + opts.parser);
        }

        const tabsData = transform[opts.parser](tabsfile);
        if (opts['dry-run']) {
          jsome(tabsData);
        } else {
          const returnData = await importTabs(tabsData);
          console.log(returnData);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log('File does not exists');
    }
  })
  .parse(process.argv);
