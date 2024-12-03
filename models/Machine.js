import mongoose from 'mongoose';
import domPurifier from 'dompurify';
import { JSDOM } from 'jsdom';
const htmlPurify = domPurifier(new JSDOM().window);

import {stripHtml} from 'string-strip-html';

const machineSchema = new mongoose.Schema({
  machineName: String,
  description: String,
  imageUrl: String,
  snippet: {
    type: String,
    index: true 
  }
});

machineSchema.pre('validate', function (next) {
  //check if there is a description

  if (this.description) {
    this.description = htmlPurify.sanitize(this.description);
    this.snippet = stripHtml(this.description.substring(0, 200)).result
  }

  next();

})

export default mongoose.model('Machine', machineSchema);