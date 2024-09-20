import AWS from "aws-sdk";

export const S3_BUCKET = "rutvikjr-bucket";
const REGION = "ap-south-1";

AWS.config.update({
  accessKeyId: "AKIAU6GDZUMEVOJSCS6Q",
  secretAccessKey: "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",
});

export const myBucket = new AWS.S3({
  params: { Bucket: S3_BUCKET },
  region: REGION,
});
