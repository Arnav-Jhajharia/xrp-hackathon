// utils/ipfs.js

import { Web3Storage } from 'web3.storage'

/**
 * @param {object} doc  The full DID Document JSON
 * @returns {string}    An IPFS URI like 'ipfs://bafy…'
 */
export async function uploadToIPFS(doc) {
  // 1) create a client
  const token = process.env.WEB3_STORAGE_TOKEN   // load from env
  if (!token) throw new Error('Missing WEB3_STORAGE_TOKEN')

  const client = new Web3Storage({ token })

  // 2) convert JSON to a File
  const blob = new Blob([ JSON.stringify(doc) ], { type: 'application/json' })
  const files = [ new File([blob], 'did.json') ]

  // 3) store and get back the root CID
  const cid = await client.put(files, {
    name: 'did-document',
    maxRetries: 3,
  })
  // 4) return as an IPFS URI
  return `ipfs://${cid}/did.json`
}
