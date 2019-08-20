import cloudinary from 'cloudinary-core';

function getImageSrcSet(path) {
  const parts = path.split('.');
  let ext = parts.pop();
  let base = parts.join('.');


  // Load srcset small to large
  return `${base}-small.${ext} 100vw, ${base}-small@2x.${ext} 100vw 2x, ${base}-small@3x.${ext} 100vw 3x, ${base}.${ext} 1280px, ${base}@2x.${ext} 1280px 2x, ${base}@3x.${ext} 1280px 3x`;
}

function getCloudinaryFhdImageUrl(url) {
  console.log(url.replace(/upload(\/[^\/]*\/)/, 'upload/'));
  return url.replace(/upload(\/[^\/]*\/)/, 'upload/w_1920/');
}

/**
 * Cloudinary URLs generated by the core lib don't have a folder or a version, which means if
 * an image is in a folder, cloudinary will generate the wrong path (404)!
 */
async function getCloudinaryImageUrl(id, params) {
  params = Object.assign({
    cloudName: null,
    folder: null,
    version: 1,
    // Can be string or array
    transforms: ''
  }, params);

  if (typeof id !== 'string' || typeof params.cloudName !== 'string' || params.cloudName === '') {
    throw new Error('Cloud name and id must be provided in order to retrieve a cloudinary url');
  }

  if (params.folder && typeof params.folder !== 'string') {
    console.warn('Folder name must be a string');
  }

  let transforms = '';
  if (params.transforms instanceof Array && transforms.length > 0) {
    transforms = params.transforms.join('');
  } else if (typeof transforms === 'string') {
    transforms = params.transforms;
  }

  const cloudinaryCore = new cloudinary.Cloudinary({ cloud_name: params.cloudName });
  const url = await cloudinaryCore.url(id);

  if (params.folder) {
    return url.replace(/(\/)(?!.*\/)/, `${(transforms.length > 0) ? '/' + transforms : ''}/v${params.version}/${params.folder}/`);
  }

  return url;
}

export { getImageSrcSet, getCloudinaryFhdImageUrl, getCloudinaryImageUrl }
