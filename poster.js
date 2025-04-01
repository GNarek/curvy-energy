const { getPostType } = require('./scripts/services');

const { videoPoster } = require('./video-poster');
const { imagePoster } = require('./image-poster');

(async () => {
  const postType = getPostType();
  console.log(`🎲 Random pick: Posting a ${postType.toUpperCase()}`);

  if (postType === 'video' || true) {
    await videoPoster();
  } else {
    await imagePoster();
  }
})();
