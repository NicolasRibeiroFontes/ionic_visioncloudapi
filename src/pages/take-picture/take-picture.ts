import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Camera, CameraOptions } from "@ionic-native/camera";
import { HttpClient } from '@angular/common/http';

@IonicPage()
@Component({
  selector: 'page-take-picture',
  templateUrl: 'take-picture.html',
})
export class TakePicturePage {

  currentPhoto;
  key: string = '';
  url: string;
  textoRetorno: string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public camera: Camera,
    private http: HttpClient) {
    this.url = 'https://vision.googleapis.com/v1/images:annotate?key=' + this.key;
  }

  getPhoto(type) {
    this.textoRetorno = 'Aguarde! O texto será carregado aqui...';

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: type == "picture" ? this.camera.PictureSourceType.CAMERA : this.camera.PictureSourceType.SAVEDPHOTOALBUM,
      correctOrientation: true
    };

    this.camera.getPicture(options).then((imageData) => {

      this.currentPhoto = 'data:image/jpeg;base64,' + imageData;
      this.sendPhoto(imageData);
    }, (err) => {
      // Handle error
    });
  }

  sendBase64(base64, type, maxResults) {
    return {
      "requests": [
        {
          "image": {
            "content": base64
          },
          "features": [
            {
              "type": type,
              "maxResults": maxResults
            }
          ]
        }
      ]
    }
  }

  sendPhoto(photo) {
    var enviado = this.sendBase64(photo, 'TEXT_DETECTION', 10);
    return this.http.post(this.url, enviado).subscribe(data => {
      console.log(data);
      this.textoRetorno = data['responses'][0]['textAnnotations'][0]['description'];
    });
  };
}