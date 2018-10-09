const request = require('supertest');

describe('messageTplRouter api test', () => {

  it('should throw login fail because of more login fail', async () => {
    const res = await request.post('/message/api/messageTpl')
      .send({
        tplName: 'beautiful',
        tplContent: 'amazing',
        tplType: 'dada',
      })
      .expect(200);
    console.log(res.body);
    res.body.message.should.be.contain('account has been frozen');
  });
});
