import fs from "fs/promises";
import path from "path";
import { DATA_DIR, OUTPUT_DIR, UPLOADS_DIR } from "../../config/paths.js";
import updateProgress, { StatusType } from "../../util/socket-update-progress.js";

/**
 * @param {Object} jsonObject - The object that contains the data for video rendering
 * @param {Object} jsonObject.data - The data object
 * @param {string[]} jsonObject.data.images - The array of image paths
 * @param {string} jsonObject.data.audio - The path to the audio file
 * @param {number} jsonObject.data.duration - The duration of the video in ms
 */
export default async function formating_output(jsonObject, outputPath) {
  const audio = jsonObject.data.audio;
  const images = jsonObject.data.images;
  const audioExt = path.extname(audio);
  const genericName = audio.split(audioExt)[0];
  updateProgress(jsonObject.data.uploadId, StatusType.REMOVE_TEMP, "❌ Removing Temporary Files");

  try {
    // Make Directory to Output Folder
    const outputFolder = path.join(OUTPUT_DIR, genericName);
    // await fs.mkdir(outputFolder);

    // Move the Audio
    const audioFilePath = path.join(UPLOADS_DIR, audio);
    // await fs.rename(audioFilePath, path.join(outputFolder, audio));
    // Remove the audio File
    await fs.rm(audioFilePath);

    // Move the Vide Output
    const ext = path.extname(outputPath);
    // await fs.rename(outputPath, path.join(outputFolder, genericName + ext));

    // Move the Images
    for await (let image of images) {
      const imageFilePath = path.join(UPLOADS_DIR, image);
      const ext = path.extname(image);
      const random = Math.random().toString(36).substring(7);
      const newFileName = `${genericName}-${random}${ext}`;
      // await fs.rename(imageFilePath, path.join(outputFolder, newFileName));
      // Remove the image File
      await fs.rm(imageFilePath);
    }

    // Delete ffmpeg 16bit audio file
    const deleteFilePath = path.join(UPLOADS_DIR, "output_" + genericName + ".wav");
    // await fs.rm(deleteFilePath);

    // Delete the data/json file
    const dataFilePath = path.join(DATA_DIR, `data-${genericName}.json`);
    // check if the file exists before deleting
    // try {
    //   await fs.access(dataFilePath);
    //   await fs.rm(dataFilePath);
    // } catch (error) {
    //   console.error(`File ${dataFilePath} does not exist.`);
    //   return;
    // }
  } catch (error) {
    updateProgress(jsonObject.data.uploadId, StatusType.ERROR, JSON.stringify(error));
    console.error(error);
  }
}
