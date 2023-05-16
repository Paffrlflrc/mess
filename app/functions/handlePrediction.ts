import axios from 'axios';
import { axiosPolling } from 'axios-polling';

axiosPolling(axios, { retryLimit: 10 });

const handlePrediction = async (input: string): Promise<string> => {
  const { data: result } = await axios
    .post('/prediction?sequence', {
      data: {
        amino_acid_seq: input,
      },
    })
    .catch((reason) => {
      // eslint-disable-next-line no-console
      console.error(reason);
      throw new Error('启动请求发送失败');
    });
  return new Promise((resolve, reject) => {
    if (result || result.success) {
      const { emit, on, off, remove } = axios.poll({
        url: '/prediction/status',
        params: {
          job_id: result.job_id,
        },
      });
      emit();
      on('response', (response) => {
        if (response.data.status === 'finish') {
          off();
          remove();
          axios
            .get('/prediction/result', {
              params: {
                job_id: result.job_id,
                type: 'pdb',
              },
            })
            .then(({ data }) => {
              // eslint-disable-next-line promise/always-return
              if (data || data.success) {
                resolve(data.result);
              }
              reject(new Error('获取预测结果失败'));
            })
            .catch((error) => {
              // eslint-disable-next-line no-console
              console.error(error);
              reject(new Error('获取预测结果请求发送失败'));
            });
        }
      });
      on('error', (error) => {
        // eslint-disable-next-line no-console
        console.error(error.toJSON());
        reject(new Error('获取预测进度失败'));
      });
    } else {
      reject(new Error('创建任务失败'));
    }
  });
};

export default handlePrediction;
