const video = document.getElementById('video')

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models')
]).then(startVideo)

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

function getEmotion(objet){
  if(objet.happy >= 0.90 && objet.happy <1.1){
     return 'happy'
  }else if(objet.surprised >= 0.90 && objet.surprised <1.1){
    return 'surprised'
  }else if(objet.sad >= 0.90 && objet.sad <1.1){
    return 'sad'
  }else{
    return 'neutre'
  }
  
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);

  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, 
    new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceExpressions();

    const emotion = getEmotion(detections[0].expressions);

    let img = document.getElementById('avatar');
    img.src =`image/${emotion}.png`;
  }, 100)
})

const chat = document.getElementsByClassName('chat')[0]

const messageChat = ["<p><span class='red'>BobyDu78 : </span> C'est quoi le jeu?</p>','<p>lolo</p>', '<p>lulu</p>" ]


let index = 0;

function afficherMessage() {
  chat.innerHTML += messageChat[index];
  index++;

  if (index === messageChat.length) {
    index = 0; // Revenir au premier message après le dernier
  }
}

afficherMessage();
setInterval(afficherMessage, 10000);


