import * as fileService from "fs";
import * as sha1 from "sha1";
import { IData } from "../interfaces/i-data";
import { IResponse } from "../interfaces/i-response";
import { CodenationClient } from "../clients/codenation-client";

class DecipherService {

  public saveData(data: string): void {
    try {
      fileService.writeFileSync('answer.json', data, 'utf-8');
      console.info("Data saved on file");
    } catch (err) {
      console.error(`Error trying to save file: ${err}`);
      throw err;
    }
  }

  public readData(): string {
    try {
      let data = fileService.readFileSync('answer.json', 'utf8');
      console.info("Data read from file");
      return data;
    } catch (err) {
      console.error(`Error trying to read file: ${err}`);
      throw err;
    }
  }

  public updateData(data: IData): IData {
    this.saveData(JSON.stringify(data));
    return data;
  }

  // TODO: remove magic numbers 
  public decipherData(cipherMessage, key: number): string {
    cipherMessage = cipherMessage.toLowerCase().replace(/['"]+/g, '');

    return cipherMessage.split("")
      .map(item => item.charCodeAt() - 97)
      .map(index => {
        if (index >= 0 && index <= 25) {
          let shiftKey = index - (key % 26); // use the mod to adjust the key to a range between 0 and 25
          if (shiftKey < 0) {
            shiftKey = 26 + shiftKey;
            return String.fromCharCode(shiftKey + 97);
          }
          return String.fromCharCode((shiftKey % 26) + 97);
        } else {
          return String.fromCharCode(index + 97);
        }
      }).join("");
  }

  public async execute(token: string): Promise<IResponse> {
    try {
      // Get information from Codenation api
      const codenationClient = new CodenationClient();
      let data: IData = await codenationClient.getInformation(token);
      console.log("Data: ", data);

      // Save data on answer.json file
      this.saveData(JSON.stringify(data));

      // Decipher the text
      let decipheredMessage = this.decipherData(data.cifrado, data.numero_casas);

      // Read the file to get the information
      let dataFromFile: IData = JSON.parse(this.readData());

      // Update the decifrado field with the response 
      dataFromFile.decifrado = decipheredMessage;

      // Update the resumo_criptografico field with the sha1 crypto
      dataFromFile.resumo_criptografico = sha1(decipheredMessage);

      // Update the answer.json file with the new content
      dataFromFile = this.updateData(dataFromFile);

      // Post the response on Codenation api
      let submitResponse = await codenationClient.submit(token);

      let response: IResponse = {
        data: dataFromFile,
        submitResponse
      };

      return response;
    } catch (err) {
      console.error(`Error: ${err}`);
      throw err;
    }
  }

}

export default DecipherService;