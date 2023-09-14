import { NextApiHandler, NextApiRequest } from 'next';
import formidable from 'formidable';
import path from 'path';
import fs from 'fs';
import axios from 'src/lib/axios';
import FormData from 'form-data';
import { getServerSession } from 'next-auth/next';
import { authOptions } from 'src/pages/api/auth/[...nextauth]';
// Types
import { Session } from 'next-auth';

export const config = {
  api: {
    bodyParser: false,
  },
};

let filePath;

const readFile = (
  req: NextApiRequest,
  saveLocally?: boolean
): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  const options: formidable.Options = {};

  if (saveLocally) {
    // eslint-disable-next-line no-shadow
    options.uploadDir = path.join(process.cwd(), '/public/uploads');
    // eslint-disable-next-line no-shadow
    options.filename = (name, ext, filePathParam, form) => {
      const fileName = `${Date.now().toString()}_${filePathParam.originalFilename}` as string;
      filePath = `${process.cwd()}/public/uploads/${fileName}` as string;

      return fileName;
    };
  }
  options.maxFileSize = 4000 * 1024 * 1024;
  const form = formidable(options);
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};

const handler: NextApiHandler = async (req, res) => {
  try {
    // log the file from the request

    const session = (await getServerSession(req, res, authOptions)) as Session | null;
    const accessToken = session?.accessToken;

    await fs.promises.readdir(path.join(process.cwd(), '/public', '/uploads'));
    const { files } = await readFile(req, true);
    const file = files?.file;

    if (file) {
      const { name: fileName, type: fileType } = file;

      const fileStream = fs.createReadStream(filePath);

      const formData = new FormData();
      formData.append('file', fileStream);

      const response = await axios.post('/files', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const uploadedFileURL = response.data.url;
      res.json({ fileURL: uploadedFileURL });
    } else {
      res.status(400).json({ error: 'No file found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export default handler;
