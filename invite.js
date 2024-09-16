require('dotenv').config();
const axios = require('axios');
const ethers = require('ethers');
const logger = require('logger-syskey');
const readLines = require('readfile-syskey');
const randomUseragent = require('random-useragent');


const inviteCode = process.env.INVITE_CODE;

let invite = async (address, signature) => {
    let url = "https://www.freecoin.meme/api/register";
    let config = {
        headers: {
            'accept': '*/*',
            'accept-language': 'en-US,en;q=0.9',
            'cache-control': 'no-cache',
            'content-type': 'application/json',
            'cookie': '_referer=',
            'origin': 'https://www.freecoin.meme',
            'pragma': 'no-cache',
            'priority': 'u=1, i',
            'referer': `https://www.freecoin.meme/?shareFrom=${inviteCode}`,
            'sec-ch-ua': '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
            'sec-ch-ua-mobile': '?0',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'user-agent': randomUseragent.getRandom()
        }
    };
    let payload = {
        "address": address,
        "signature": signature,
        "shareCode": inviteCode,
        "wallet": "MetaMask"
    };

    let res = await axios.post(url, payload, config);
    let { score } = res?.data?.data;
    if (score !== 0) {
        logger.info(`${address} ✅ 注册成功 - score: ${score}`)
    };
};

let run = async (pk) => {
    let wallet = new ethers.Wallet(pk);
    let message = "Please sign to begin analyzing your address for $FREE airdrop eligibility. This signature is for verification purposes only, will not incur gas fees, and will not affect your assets.";
    try {
        let signature = await wallet.signMessage(message);
        await invite(wallet.address, signature);
    } catch (err) {
        logger.error(err);
    };
};

let main = async () => {
    logger.info(`⌛️ 正在执行 freecoin.meme 注册任务~~`);
    logger.info(`✅ 免费脚本, 请勿上当受骗✅`);
    let pks = await readLines('./pks.txt');
    for (let pk of pks) {
        await run(pk);
    };
};

main();