import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LoadingController } from '@ionic/angular';

declare var google;


import { Bin } from '../bin';
import { BinsService } from '../services/bins.service';

@Component({
  selector: 'app-home', 
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  mapRef = null;
  
  latitude: number;
  longitude: number;
  public bin: Bin[];


  constructor(
    private geolocation: Geolocation,
    private loadingCtrl: LoadingController,
    private binsService: BinsService,
  ) {

  }
 
  ngOnInit() {
    this.loadMap();
    this.getBinData();
  }

  async loadMap() {
    
    const loading = await this.loadingCtrl.create();
    loading.present();
    const myLatLng = await this.getLocation();
    const mapEle: HTMLElement = document.getElementById('map');
    this.mapRef = new google.maps.Map(mapEle, {
      center: myLatLng,
      zoom: 12
    });
    google.maps.event
    .addListenerOnce(this.mapRef, 'idle', () => {
      loading.dismiss();
      this.addMaker(myLatLng.lat, myLatLng.lng);
    });
    this.getBinData();
  }

  private addMaker(lat: number, lng: number) {
    new google.maps.Marker({
      position: { lat, lng },
      map: this.mapRef,
      title: 'Hello World!',
      icon:'assets/img/bin_point_true.svg',
    }); 
  }
 

  private async getLocation() {
    const rta = await this.geolocation.getCurrentPosition();
    return {
/*       lat: rta.coords.latitude,
      lng: rta.coords.longitude */
      lat: 40.41886,
      lng: -3.7117,
    };
  }


  getBinData(): any {
    this.binsService.getBinData()
      .subscribe(
      (bin_observable) => {
       // bin_observable.length
        for(let i = 0; i <10;i++){
          let lat = parseFloat(bin_observable[i].address[0].lat);
          let lng = parseFloat(bin_observable[i].address[0].lng);
          let statusBin= bin_observable[i].bag;
          if (statusBin===true){
            new google.maps.Marker({
            position: { lat, lng },
              map: this.mapRef,
              title: bin_observable[i].address[0].addressName,
              icon:'assets/img/bin_point_true.svg'
            });
          }
          else{
          new google.maps.Marker({
          position: { lat, lng },
            map: this.mapRef,
            title: bin_observable[i].address[0].addressName,
            icon:'assets/img/bin_point_false.svg'
          });
        } 
        }
        
      });
  }
}