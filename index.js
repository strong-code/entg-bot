const request = require('request')
const _ = require('lodash')
const Discord = require('discord')
const hook = new Discord.WebhookClient('', '')
const pollInterval = 1000 // 3 minutes
const apiEndpoint  = "https://a.4cdn.org/biz/catalog.json"
let lastThreadId   = ''

console.log('started')

const parsePages = function(catalog) {
  _.each(catalog, (pages) => {
    _.each(pages['threads'], (thread) => {
      if (_.includes(thread['sub'], 'entg')) {
        if (thread['no'] === lastThreadId) {
          return;
        } else {
          lastThreadId = thread['no']
          return reportNewThread(thread)
        }
      }
    })
  })
}

const reportNewThread = function(thread) {
  console.log('https://boards.4chan.org/biz/thread/' + thread['no'])
}

// setInterval(() => {
  request.get(apiEndpoint, (err, res, body) => {
    if (err) {
      console.log(err)
      return
    }

    let catalog = JSON.parse(body)
    return parsePages(catalog)
  })
// }, pollInterval)
