const request = require('request')
const _ = require('lodash')
const Discord = require('discord.js')
const hook = new Discord.WebhookClient('513533752312463381', 'pp3YX_XIMDURNpTfyDGo9_58-p22aWvY5QWLU3JymBovS2G0GgTr-VZNxpy2En1ZPhJW')
const pollInterval = 1000 * 60// check every 1 minute
const apiEndpoint  = "https://a.4cdn.org/biz/catalog.json"
let lastThreadId   = '11780476'

console.log('started')

const parsePages = function(catalog) {
  _.each(catalog, (pages) => {
    _.each(pages['threads'], (thread) => {
      if (_.includes(thread['sub'], 'entg')) {
        if (thread['no'] === lastThreadId) {
          console.log('No new thread found (current thread id: ' + lastThreadId + ')')
          return;
        } else {
          lastThreadId = thread['no']
          console.log('New thread found (id: ' + lastThreadId + ')')
          return reportNewThread(thread)
        }
      }
    })
  })
}

const reportNewThread = function(thread) {
  let url = 'https://boards.4chan.org/biz/thread/' + thread['no']
  hook.send('@here ➡️ New /entg/ thread found: ' + url)
}

setInterval(() => {
  request.get(apiEndpoint, (err, res, body) => {
    if (err) {
      console.log(err)
      return
    }

    let catalog = JSON.parse(body)
    return parsePages(catalog)
  })
}, pollInterval)
