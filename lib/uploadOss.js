import 'babel-polyfill';
import fs from 'fs';
import ALY from 'aliyun-sdk';

const zlib = require('zlib');
const gzip = zlib.createGzip();

var newSourcePath;
var newTargetPath;
export default async function(sourcePath, targetPath, options){
	const oss = new ALY.OSS({
		accessKeyId: process.env.ALIYUN_OSS_ACCESS_KEY_ID,
		secretAccessKey: process.env.ALIYUN_OSS_SECRET_ACCESS_KEY,
		endpoint: 'http://'+process.env.ALIYUN_OSS_ENDPOINT,
		apiVersion: '2013-10-15'
	});
	newSourcePath = sourcePath;
	newTargetPath = targetPath;
	await zipFiles(sourcePath);


	var ossStream = require('aliyun-oss-upload-stream')(oss);

	return new Promise((resolve, reject) => {
		var upload = ossStream.upload({
			Bucket: process.env.ALIYUN_OSS_BUCKET,
			Key: newTargetPath,
			...options
		});
		upload.on('error', (err) => {
			console.log(err);
			reject();
		});
		upload.on('uploaded', resolve);
		var read = fs.createReadStream(newSourcePath);
		read.pipe(upload);
	});
};

function* listfiles(){
	console.log('all files: ');
	const testFolder = './';
	fs.readdirSync(testFolder).forEach(file => {
		console.log(file);
	});
}
function zipFiles(sourcePath){
	newSourcePath = newSourcePath+'.gz';
	newTargetPath = newTargetPath+'.gz';
	const inp = fs.createReadStream(sourcePath);
	const out = fs.createWriteStream(newSourcePath)
	console.log('newTargetPath = ', newTargetPath);
	console.log('new source path = ', newSourcePath);
	
	return new Promise((resolve, reject) => {
		out.on('finish', resolve);
		inp.pipe(gzip).pipe(out);			
	});
}	
