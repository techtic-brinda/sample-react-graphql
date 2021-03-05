import { join } from 'path';
import * as fs from 'fs';

const UPLOAD_DIR_NAME = 'public/uploads';

export async function resolveUpload(upload) {
    
    const { filename, mimetype, encoding, createReadStream } = upload;
    const stream = createReadStream();
    // Save file to the local filesystem
    const { id, filepath } = await saveLocal({ stream, filename });
    // Return metadata to save it to Postgres
    return {
        id,
        filepath,
        filename,
        mimetype,
        encoding
    };
}

function saveLocal({ stream, filename }):any {
  
    const timestamp = new Date().toISOString().replace(/\D/g, "");
    const name = `${timestamp}_${filename}`;

    const upload_path = UPLOAD_DIR_NAME + "/" + (new Date()).getFullYear();

    if (!fs.existsSync(join(process.cwd(),upload_path ))) {
        fs.mkdirSync(join(process.cwd(),upload_path ), { recursive: true });
    }

    const filepath = join(upload_path, name);
    const fsPath = join(process.cwd(), filepath);

    return new Promise((resolve, reject) =>
        stream
            .on("error", error => {
                if (stream.truncated)
                    // Delete the truncated file
                    fs.unlinkSync(fsPath);
                reject(error);
            })
            .pipe(fs.createWriteStream(fsPath))
            // .on("end", () => {
            //     console.log('stream end');
            // })
            .on('finish', () => { resolve({ name, filepath }) })
    );
}