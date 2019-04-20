import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

import { User } from '../user';
import { Bin } from '../bin';
import { UsersService } from '../services/users.service';
import { BinsService } from '../services/bins.service';
import { StorageService } from '../services/storage.service';



@Component({
  selector: 'app-selected-bin',
  templateUrl: './selected-bin.component.html',
  styleUrls: ['./selected-bin.component.scss'],
})

export class SelectedBinComponent implements OnInit {

  public favoriteBins: Bin[];
  public _selectedBinId: string;
  public binInfo: any;
  public users: User[];
  public user: any;

  @Output() bagsChangedEvent = new EventEmitter<string>();

  constructor(
    private usersService: UsersService,
    private binsService: BinsService,
    private storageService: StorageService
  ) {
    this.getLocalStorage();
  }

  get selectedBinId(): string {
    // transform value for display
    return this._selectedBinId;
  }

  @Input()
  set selectedBinId(selectedBinId: string) {
    this._selectedBinId = selectedBinId;
    if (selectedBinId.length) {
      this.getOneBinInfo(selectedBinId);
    }
  }


  ngOnInit() {
  }

  getOneBinInfo(selectedBinId: Bin['_id']): any {
    this.binsService.getOneBinInfo(selectedBinId)
      .subscribe(
        (bin_observable) => {
        this.binInfo = bin_observable;
        }
      );
  }

  async getLocalStorage() {
    this.user = await this.storageService.getUsers();
    await this.getUserFavoriteBinsData(this.user._id);
  }

  getUserFavoriteBinsData(userId): any {
    this.usersService.getUserFavoriteBinsData(userId)
      .subscribe(
        (bin_observable) => {
          this.favoriteBins = [];
          // bin_observable.length
          console.log('hay ' + bin_observable.length + ' papeleras favoritas');
          for (let i = 0; i < bin_observable.length; i++) {
            this.favoriteBins.push(bin_observable[i]);
          }

        });

  }


  // Gets userId from the atribute of this class
  // Gets selectedBinId from home.page.ts
  addFavorite(userId: User['_id'], selectedBinId: Bin['_id']): void {
    const findBin = this.favoriteBins.find(bin => bin._id === selectedBinId);
    if (!findBin) {
      this.usersService.addFavoriteBin(userId, selectedBinId)
        .subscribe();
    } else {
      this.usersService.deleteBin(userId, selectedBinId)
        .subscribe();
    }
    this.getUserFavoriteBinsData(userId);
    // this.homePage.getBinData();
  }

  changeBinBag(selectedBin: Bin['_id']): void {
    this.binsService.updateBinBags(selectedBin, !this.binInfo.bag).subscribe();
    this.bagsChangedEvent.next(selectedBin.toString());
  }


}
