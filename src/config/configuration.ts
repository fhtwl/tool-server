// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
const {
  AUDIO_2_TXT_BAIDU_AK,
  AUDIO_2_TXT_BAIDU_SK,
  TXT_2_AUDIO_Volcengine_APPID,
  TXT_2_AUDIO_Volcengine_TOKEN,
  TXT_2_AUDIO_Volcengine_SK,
  TXT_2_AUDIO_Volcengine_CLUSTER,
} = process.env;
export default () => ({
  port: process.env.HTTP_PORT || 3000,
  websocketPort: Number(process.env.WEBSOCKET_PORT),
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME,
  },
  // redis: {
  //   host: process.env.REDIS_HOST,
  //   port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  //   password: process.env.REDIS_PASSWORD,
  //   db: parseInt(process.env.REDIS_DB, 10),
  //   ttl:
  //     process.env.REDIS_TTL.split('*')
  //       .map((str) => Number(str))
  //       .reduce((prev: number, curr: number) => {
  //         return prev * curr;
  //       }) || 6,
  // },
  // bull: {
  //   redis: {
  //     db: parseInt(process.env.BULL_REDIS_DB, 10),
  //   },
  // },
  jwt: {
    secret: 'wet5ykmu45643)2@#k;a+tm46m.02l,a!',
    expiresIn: 60 * 60 * 24 * 0.5,
  },
  gpt: {
    apiKey: process.env.OPENAI_API_KEY,
    apiUrl: process.env.OPENAI_API_URL,
  },
  apiPrefix: process.env.API_PREFIX,
  swagger: {
    title: process.env.API_DOCUMENT_TITLE,
  },
  upload: {
    dirPath: process.env.UPLOAD_DIR_PATH,
    dirPrefix: process.env.UPLOAD_DIR_PREFIX,
  },
  tmp: {
    dirPath: process.env.TMP_DIR_PATH,
    dirPrefix: process.env.TMP_DIR_PREFIX,
  }, // 临时目录
  sms: {
    key: process.env.SMS_KEY,
    secret: process.env.SMS_SECRET,
  },
  baiduAudio2txt: {
    ak: AUDIO_2_TXT_BAIDU_AK,
    sk: AUDIO_2_TXT_BAIDU_SK,
  },
  volcengine: {
    appid: TXT_2_AUDIO_Volcengine_APPID,
    token: TXT_2_AUDIO_Volcengine_TOKEN,
    cluster: TXT_2_AUDIO_Volcengine_CLUSTER,
    sk: TXT_2_AUDIO_Volcengine_SK,
  },
  cozeToken:
    'pat_GQAbTHS1MzxFvphJwHIPI5edRQQ6xDlSW6mVL2XpojY3jmm8jiwamZFbHgq0LIXc',
});
