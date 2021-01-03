import express, {Request, Response} from 'express'
import * as util from 'util'

const router = express.Router()

  router.get('/login', (req: Request, res:Response) => {
    res.send(`
      <html>
        <body>
          <form action="/login" method="post">
            <input type="hidden" name="responseurl" value="${req.query.responseurl}" />
            <button type="submit" style="font-size:14pt">Link this service to Google</button>
          </form>
        </body>
      </html>
    `)
  })

  router.post('/login', async (req: Request, res:Response) => {
    // Here, you should validate the user account.
    // In this sample, we do not do that.
    const responseurl = decodeURIComponent(req.body.responseurl)
    console.log('responseurl:', responseurl)
    return res.redirect(responseurl)
  })
  
  router.get('/fakeauth', async (req:Request, res:Response) => {
    const responseurl = util.format('%s?code=%s&state=%s',
      decodeURIComponent(req.query.redirect_uri as string), 'xxxxxx',
      req.query.state)
    return res.redirect(`/login?responseurl=${encodeURIComponent(responseurl)}`)
  })

  router.all('/faketoken', async (req, res) => {
    const grantType = req.query.grant_type
      ? req.query.grant_type : req.body.grant_type
    const secondsInDay = 86400 // 60 * 60 * 24
    const HTTP_STATUS_OK = 200
    console.log(`Grant type ${grantType}`)
    let obj
    if (grantType === 'authorization_code') {
      obj = {
        token_type: 'bearer',
        access_token: '123access',
        refresh_token: '123refresh',
        expires_in: secondsInDay,
      }
    } else if (grantType === 'refresh_token') {
      obj = {
        token_type: 'bearer',
        access_token: '123access',
        expires_in: secondsInDay,
      }
    }
    res.status(HTTP_STATUS_OK).json(obj)
  })
 
export { router as authRouter }
