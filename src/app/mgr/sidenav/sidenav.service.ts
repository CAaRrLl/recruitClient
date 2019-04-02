import { Injectable } from '@angular/core';
import { SidenavItem } from './item/item.model';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {MeditorService} from '../../services/meditor.service';
import {roles} from '../../../constant/urls';

@Injectable()
export class SidenavService {
  private _itemsSubject: BehaviorSubject<SidenavItem[]> = new BehaviorSubject<SidenavItem[]>([]);
  private _items: SidenavItem[] = [];
  items$: Observable<SidenavItem[]> = this._itemsSubject.asObservable();
  private _currentlyOpenSubject: BehaviorSubject<SidenavItem[]> = new BehaviorSubject<SidenavItem[]>([]);
  private _currentlyOpen: SidenavItem[] = [];
  constructor(private meditor: MeditorService) {
      roles.mgr.nav.forEach((v, index) => {
          if(v.userLevel && !this.checkLevel(v.userLevel)) {
            return;
          }
          const it = this.addItem(v.name, v.icon, v.url, index);
          v.sub.forEach((subV, subIndex) => {
            if(subV.userLevel && !this.checkLevel(subV.userLevel)) {
              return;
            }
            this.addSubItem(it, subV.name, subV.url, subIndex);
          });
      });
  }
  checkLevel(levels:string[]): boolean {
    const level = localStorage.getItem('level');
    for(const lv of levels){
      if(lv === level) {
        return true;
      }
    }
    return false;
  }
  addItem(name: string, icon: string, route: any, position: number, badge?: string, badgeColor?: string, customClass?: string) {
    const item = new SidenavItem({
      name: name,
      icon: icon,
      route: route,
      subItems: [],
      position: position || 99,
      badge: badge || null,
      badgeColor: badgeColor || null,
      customClass: customClass || null
    });
    this._items.push(item);
    this._itemsSubject.next(this._items);
    return item;
  }

  addSubItem(parent: SidenavItem, name: string, route: any, position: number) {
    const item = new SidenavItem({
      name: name,
      route: route,
      parent: parent,
      subItems: [],
      position: position || 99
    });
    parent.subItems.push(item);
    this._itemsSubject.next(this._items);
    return item;
  }

  removeItem(item: SidenavItem) {
    const index = this._items.indexOf(item);
    if (index > -1) {
      this._items.splice(index, 1);
    }

    this._itemsSubject.next(this._items);
  }

  isOpen(item: SidenavItem) {
    return (this._currentlyOpen.indexOf(item) !== -1);
  }

  toggleCurrentlyOpen(item: SidenavItem) {
    let currentlyOpen = this._currentlyOpen;
    if (this.isOpen(item)) {
      if (currentlyOpen.length > 1) {
        currentlyOpen.length = this._currentlyOpen.indexOf(item);
      } else {
        currentlyOpen = [];
      }
    } else {
      currentlyOpen = this.getAllParents(item);
    }

    this._currentlyOpen = currentlyOpen;
    this._currentlyOpenSubject.next(currentlyOpen);
  }

  getAllParents(item: SidenavItem, currentlyOpen: SidenavItem[] = []) {
    currentlyOpen.unshift(item);

    if (item.hasParent()) {
      return this.getAllParents(item.parent, currentlyOpen);
    } else {
      return currentlyOpen;
    }
  }

  nextCurrentlyOpen(currentlyOpen: SidenavItem[]) {
    this._currentlyOpen = currentlyOpen;
    this._currentlyOpenSubject.next(currentlyOpen);
  }

  nextCurrentlyOpenByRoute(route: string) {
    const currentlyOpen = [];
    const item = this.findByRouteRecursive(route, this._items);
    // if (item && item.hasParent()) {
    //   currentlyOpen = this.getAllParents(item);
    // } else if (item) {
    //   currentlyOpen = [item];
    // }
    //
    // this.nextCurrentlyOpen(currentlyOpen);
  }
  findByRouteRecursive(route: string, collection: SidenavItem[]) {
    let result = collection.filter((item) => {
      if (item.route === route) {
        return item;
      }
    });
    if (!result) {
      collection.forEach((item) => {
        if (item.hasSubItems()) {
          const found = this.findByRouteRecursive(route, item.subItems);
          if (found) {
            result = found;
            return false;
          }
        }
      });
    }

    return result;
  }

  get currentlyOpen() {
    return this._currentlyOpen;
  }

  getSidenavItemByRoute(route) {
    return this.findByRouteRecursive(route, this._items);
  }

}
