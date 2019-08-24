import * as request from "request-promise-native";
import * as fs from "fs";
import { IData } from "../interfaces/i-data";

export class CodenationClient {
  public getInformation(): Promise<IData> {
    const baseUrl = "https://api.codenation.dev";
    return request({
      method: "GET",
      baseUrl,
      uri: "/v1/challenge/dev-ps/generate-data",
      qs: {
        token: ""
      },
      json: true,
      resolveWithFullResponse: true,
      simple: false
    }).promise()
      .then(response => { return response.body })
      .catch(error => {
        console.error(error);
        throw error;
      });
  }

  public submit(): Promise<void> {
    const baseUrl = "https://api.codenation.dev";
    return request({
      method: "POST",
      baseUrl,
      uri: "/v1/challenge/dev-ps/submit-solution",
      qs: {
        token: ""
      },
      formData: {
        answer: {
          value: fs.createReadStream('./answer.json'),
          options: {
            filename: 'answer.json',
            contentType: null
          }
        }
      },
      json: true,
      resolveWithFullResponse: true,
      simple: false
    }).promise()
      .then(response => { return response.body })
      .catch(error => {
        console.error(error);
        throw error;
      });
  }
}