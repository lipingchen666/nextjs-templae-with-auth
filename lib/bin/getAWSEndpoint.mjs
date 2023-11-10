import { MediaConvertClient, DescribeEndpointsCommand } from "@aws-sdk/client-mediaconvert";

const mediaConvertClient = new MediaConvertClient({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
})

const run = async () => {
  try {
    // Create a new service object and set MediaConvert to customer endpoint
    const data = await mediaConvertClient.send(new DescribeEndpointsCommand({}));
    console.log("Your MediaConvert endpoint is ", data.Endpoints);
    return data;
  } catch (err) {
    console.log("Error", err);
  }
};

run();