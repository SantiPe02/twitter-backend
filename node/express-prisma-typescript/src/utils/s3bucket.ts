import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3Client = new S3Client({
  region: process.env.BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string
  }
})

export const getPresignedUrl = async (fileName: string): Promise<string> => {
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: fileName,
    ContentType: 'multipart/form-data'
  }

  const command = new PutObjectCommand(params)
  return await getSignedUrl(s3Client, command, { expiresIn: 3600 })
}
