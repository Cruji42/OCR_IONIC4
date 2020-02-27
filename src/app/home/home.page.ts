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
    capturedSnapURL: string;
    APIDATA: any = [];
    texto = '';
    cameraOptions: CameraOptions = {
        quality: 20,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
    };

    constructor(private camera: Camera, private httpClient: HttpClient) { }

    takeSnap() {
        this.camera.getPicture(this.cameraOptions).then((imageData) => {
            // this.camera.DestinationType.FILE_URI gives file URI saved in local
            // this.camera.DestinationType.DATA_URL gives base64 URI

            let base64Image = 'data:image/jpeg;base64,' + imageData;
            this.capturedSnapURL = base64Image;
        }, (err) => {

            console.log(err);
            // Handle error
        });
    }
    mandarIMG() {
        const formData = new FormData();
        formData.append('base64Image', this.capturedSnapURL);
        formData.append('language', 'eng');
        formData.append('isOverlayRequired', 'false');

        const encabezados = 'd95a3e5b6a88957';
        this.httpClient.post(this.SERVER_URL, formData, {
            headers: new HttpHeaders().set('apikey', encabezados )}).subscribe(
            (res: any) => {
            this.APIDATA = res;
            console.log(this.APIDATA.ParsedResults[0].ParsedText);
            this.texto = this.APIDATA.ParsedResults[0].ParsedText;
            },
            (err) => { console.log(err); }
        );
    }
}
