import { expect, test } from "bun:test";
import { validateContent } from "../../../../scripts/content-validation";
import {
  errorCodes as areaErrors,
  operations as areaOperations,
} from "../../../calculators/src/area/index";
import areaMetadata from "../../../calculators/src/area/metadata.json" with {
  type: "json",
};
import {
  errorCodes as pythagoreanErrors,
  operations as pythagoreanOperations,
} from "../../../calculators/src/pythagorean/index";
import pythagoreanMetadata from "../../../calculators/src/pythagorean/metadata.json" with {
  type: "json",
};
import {
  errorCodes as volumeErrors,
  operations as volumeOperations,
} from "../../../calculators/src/volume/index";
import volumeMetadata from "../../../calculators/src/volume/metadata.json" with {
  type: "json",
};
import { messages as areaMessages } from "../../../i18n/src/topics/area";
import { messages as pythagoreanMessages } from "../../../i18n/src/topics/pythagorean";
import { messages as volumeMessages } from "../../../i18n/src/topics/volume";
import { lesson as pythagoreanLesson } from "../pythagorean/index";
import { lesson as volumeLesson } from "../volume/index";
import { lesson as areaLesson } from "./index";

const metadata = [areaMetadata, volumeMetadata, pythagoreanMetadata];

test("geometry metadata, lesson keys, examples, and engine descriptors agree", () => {
  const catalog = metadata.map(
    ({ id, titleKey, descriptionKey, searchKeys }) => ({
      id,
      titleKey,
      descriptionKey,
      searchKeys,
    }),
  );
  const schemas = Object.fromEntries(
    metadata.map(({ id, inputSchemaVersion, operations }) => [
      id,
      { version: inputSchemaVersion, operations },
    ]),
  );
  const messages = {
    area: areaMessages,
    volume: volumeMessages,
    pythagorean: pythagoreanMessages,
  };
  const catalogMessages = Object.fromEntries(
    metadata.flatMap(({ id, titleKey, descriptionKey, searchKeys }) => [
      [titleKey, `${id} title`],
      [descriptionKey, `${id} description`],
      ...searchKeys.map((key) => [key, `${id} search`]),
    ]),
  );
  expect(
    validateContent({
      catalog,
      schemas,
      lessons: {
        area: areaLesson,
        volume: volumeLesson,
        pythagorean: pythagoreanLesson,
      },
      topicMessages: messages,
      operations: {
        area: areaOperations,
        volume: volumeOperations,
        pythagorean: pythagoreanOperations,
      },
      errorCodes: {
        area: areaErrors,
        volume: volumeErrors,
        pythagorean: pythagoreanErrors,
      },
      catalogMessages,
    }),
  ).toEqual([]);
});
