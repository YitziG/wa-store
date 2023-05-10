import { generateDocument } from "./link_handler.mjs";

describe('test wa_store', () => {
    it('test wa-store.generateDocument', async () => {
      jest.setTimeout(20000); // Set timeout using Jest's setTimeout function

      const link = 'http://www.baidu.com';
      try {
        const path = await generateDocument("Baidu", link);
        console.log(path);
        expect(path).not.toBeNull(); // Use Jest's expect function
      } catch (err) {
        throw err;
      }
    });
  });