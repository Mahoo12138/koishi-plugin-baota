import { Context, Schema, Quester } from 'koishi'
import { AxiosRequestConfig } from 'axios'

import crypto from 'crypto';

export default class BaotaPlugin {
  name = 'baota'
  private config: AxiosRequestConfig

  constructor(ctx: Context, config: Baota.Config) {
    if (config.apikey) {
      this.config = {
        baseURL: `${config.https ? 'https' : 'http'}://${config.host}:${config.port}`,
        params: this.token(config.apikey),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }

      ctx.command("bt", "管理宝塔页面")
        .action(async ({ options, session }) => {
          console.log(this.config)
          let data =  await ctx.http.post('/system?action=GetSystemTotal',void 0, this.config)
          console.log(data)
        })
    } else {
      ctx.command("bt", "管理宝塔页面")
        .action(async ({ options, session }) => {
          return "当前未配置宝塔面板 ApiKey。"
        })
    }

  }


  token(key: string) {
    let now = Date.now()
    let request_token = this.md5(now.toString() + this.md5(key))
    return {
      "request_time": now,
      "request_token": request_token
    }
  }

  md5(data: string) {
    let hash = crypto.createHash('md5');
    return hash.update(data).digest('hex');
  }
}

export namespace Baota {
  export interface Config {
    host?: string;
    port?: number;
    apikey?: string;
    https?: boolean;
  }
  export const Config: Schema<Config> = Schema.object({
    host: Schema
      .string()
      .description('宝塔面板服务的地址。')
      .default('localhost'),
    port: Schema
      .number()
      .description('宝塔面板服务的端口。')
      .default(8888),
    apikey: Schema
      .string()
      .description('宝塔面板服务的 API 密钥。'),
    https: Schema.boolean().description('API 请求是否使用 https。').default(false)
  })
  // export interface RequestConfig extends Omit<AxiosRequestConfig, "method"> {
  //   method: 'POST'
  // }
}