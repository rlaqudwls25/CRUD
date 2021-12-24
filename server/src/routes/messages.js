import { readDB } from "../Controller.js"

const getMsgs = () => readDB('messages')

const messagesRoute = [
    {
        //전체 메시지를 가져오는 역활
        method: 'get',
        route: '/messages',
        handler: (req, res) => {
            const mags = getMsgs()
            res.send(mags)
        }
    },
    {
        //메시지 생성
        method: 'post',
        route: '/messages',
        handler: (req, res) => {
            res.send()
        }
    },
    {
        //메시지 수정
        method: 'put',
        route: '/messages/:id',
        handler: (req, res) => {
            res.send()
        }
    },
    {
        //메시지 삭제
        method: 'delete',
        route: '/messages/:id',
        handler: (req, res) => {
            res.send()
        }
    }
]

export default messagesRoute