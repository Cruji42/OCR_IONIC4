import { Component } from '@angular/core';

import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage {
    SERVER_URL = 'https://api.ocr.space/parse/image';
    capturedSnapURL = '../assets/picture.png';
    APIDATA: any = [];
    TextTranslated: any = [];
    textoEng = 'Example text';
    textoEsp = 'Example text';
    visible = false;
    loading = false;
    cameraOptions: CameraOptions = {
        quality: 20,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
    };

    constructor(private camera: Camera, private httpClient: HttpClient) { }

    takeSnap() {
        this.loading = true;
        this.visible = false;
        this.camera.getPicture(this.cameraOptions).then((imageData) => {
            // this.camera.DestinationType.FILE_URI gives file URI saved in local
            // this.camera.DestinationType.DATA_URL gives base64 URI

            const base64Image = 'data:image/jpeg;base64,' + imageData;
            this.capturedSnapURL = base64Image;
            this.mandarIMG();
        }, (err) => {

            console.log(err);
            // Handle error
        });
    }
    mandarIMG() {
        const formData = new FormData();
        formData.append('base64Image', this.capturedSnapURL);
        formData.append('language', 'spa');
        formData.append('isOverlayRequired', 'false');

        const encabezados = 'd95a3e5b6a88957';
        this.httpClient.post(this.SERVER_URL, formData, {
            headers: new HttpHeaders().set('apikey', encabezados )}).subscribe(
            (res: any) => {
            this.APIDATA = res;
            console.log(this.APIDATA.ParsedResults[0].ParsedText);
            this.textoEng = this.APIDATA.ParsedResults[0].ParsedText;
            this.traducirTXT();
            },
            (err) => { console.log(err); }
        );
    }
    traducirTXT() {
        const JSON = {
            key: 'trnsl.1.1.20200323T202341Z.ae6e2947f6b738f0.2df763f36712288588b51bc8d9bfc14fa5e6ea9f',
            lang: 'en-es',
            text: this.textoEng};
        this.httpClient.get('https://translate.yandex.net/api/v1.5/tr.json/translate?lang=en-es&text=' + this.textoEng
            + '&key=trnsl.1.1.20200323T202341Z.ae6e2947f6b738f0.2df763f36712288588b51bc8d9bfc14fa5e6ea9f').subscribe(data => {
            this.TextTranslated = data;
            this.textoEsp = this.TextTranslated.text;
            this.loading = false;
            this.visible = true;
        });
    }
}
