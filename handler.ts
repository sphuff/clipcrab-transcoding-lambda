'use strict';

import * as AWS from 'aws-sdk';

const transcodeService: AWS.ElasticTranscoder = new AWS.ElasticTranscoder();
const DEFAULT_1080_PRESET = '1351620000001-000001';
const INSTAGRAM_BOX_PRESET = '1602127497792-qek6r4';

module.exports.transcode = (event, context, callback) => {
  const records = event.Records;
  console.log(records);

  const transcodingPromises = records.map((record) => {
    const recordUrl = [
      'https://s3.amazonaws.com',
      process.env.S3_AUDIO_BUCKET,
      record.s3.object.key,
    ].join('/');

    const TranscodeJobName = record.s3.object.key;
    const params: AWS.ElasticTranscoder.CreateJobRequest = {
      PipelineId: '1601578061860-ctmm3s',
      Input: {
        Key: TranscodeJobName,
      },
      Output: {
        Key: TranscodeJobName,
        PresetId: INSTAGRAM_BOX_PRESET,
      }
      
    }

    return transcodeService.createJob(params, (err, data) => {
      console.log(data);
      return data;
    }).promise();
  });

  Promise.all(transcodingPromises)
    .then(() => {
      callback(null, { message: 'Start transcode job successfully' });
    })
    .catch(err => callback(err, { message: 'Error start transcode job' }));
};
