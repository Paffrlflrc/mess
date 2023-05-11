import { readFileSync } from 'fs';

const router = (server) => {
  server.post('/prediction', (request, reply) => {
    reply.send({
      success: true,
      job_id: new Date().toISOString(),
    });
  });

  server.get('/prediction/status', (request, reply) => {
    reply.send({
      status: 'finish',
    });
  });

  server.get('/prediction/result', (request, reply) => {
    const pdb = readFileSync('./others/test.pdb').toString();
    //
    reply.send({
      success: true,
      result: pdb,
    });
  });
};

export default router;
