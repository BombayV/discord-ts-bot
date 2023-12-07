import { v4 } from 'uuid'
import {Logger} from "tslog";

const logger = new Logger({
  name: 'InjectionManager',
  type: 'pretty',
})
const INJECTIONS = new WeakMap();

export const Injections = () => {
  const commandInjections = [];

  function Discord(Class: any) {
    INJECTIONS.set(Class, commandInjections);
    Class.__classname = Class.name as string;
    Class.__id__ = v4() as string;

    logger.info(`${Class.__classname} instanced with id ${Class.__id__}`);
    return Class;
  }

  function Command(description: string) {
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
      commandInjections.push({
        type: 'command',
        name: key,
        command: {
          name: key,
          description,
          run: descriptor.value,
        }
      })

      logger.silly(`Command ${key} injected in class ${target.constructor.name}`);
      return descriptor;
    }
  }

  function Event() {
    return function (_: any, key: string, descriptor: PropertyDescriptor) {
      commandInjections.push({
        type: 'event',
        name: key,
        event: {
          name: key,
          run: descriptor.value,
        }
      })

      logger.silly(`Event ${key} injected in class EventManager`);
      return descriptor;
    }
  }

  function getInjections() {
    return INJECTIONS;
  }

  return {
    Discord,
    Command,
    Event,
    getInjections,
  }
}