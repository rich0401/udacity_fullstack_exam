import express from 'express';
import bodyParser from 'body-parser';
import {deleteLocalFiles, filterImageFromURL} from './util/util.js';

// Init the Express application
const app = express();

// Set the network port
const port = process.env.PORT || 8082;

// Use the body parser middleware for post requests
app.use(bodyParser.json());

app.get( "/", async (req, res) => {
  res.send("try GET /filteredimage?image_url={{}}")
} );

app.get( "/filteredimage", async (req, res) => {
  console.log(req.query.image_url)
  const image_url = req.query.image_url
  try {
    const file_image = await filterImageFromURL(image_url)
    let files = [file_image]
    res.status(200).sendFile(file_image, (err) => {
      if (err) {
          console.error('Error sending file:', err);
      } else {
          console.log('File sent successfully');
          res.on('finish', () => {
            deleteLocalFiles(files)
          })
      }
    })
  } catch (error) {
    res.status(400).send("Image URL is not correct!")
  };

} );


// Start the Server
app.listen( port, () => {
    console.log( `server running http://localhost:${ port }` );
    console.log( `press CTRL+C to stop server` );
} );