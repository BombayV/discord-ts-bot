import {Client} from "discord.js";

export class EventManager {
  constructor(
    private readonly client: Client,
  ) {

  }

  test(test: string) {
    console.log(`test: ${test}`);
  }
}