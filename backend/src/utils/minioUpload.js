import fs from "fs";
import path from "path";
import { minioClient } from "../config/minio.js";

const bucket = process.env.MINIO_BUCKET;

export const ensureBucket = async () => {
  const exists = await minioClient.bucketExists(bucket);
  if (!exists) {
    await minioClient.makeBucket(bucket, "us-east-1");
  }
};

export const uploadFile = async (filePath, objectName) => {
  await ensureBucket();
  await minioClient.fPutObject(bucket, objectName, filePath);
  return `http://localhost:9000/${bucket}/${objectName}`;
};
