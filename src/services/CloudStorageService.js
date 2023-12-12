import { Storage } from "@google-cloud/storage";
import __dirname from "../utils";

export default class CloudStorageService {
    constructor(){
        this.storage = new Storage({
            keyFilename:`${__dirname}/../herosystemKey.json`
        })
        this.bucket = 'herosystems-bucket';
    }

    uploadFileToCloudStorage = (file) =>{
         
    }
}
