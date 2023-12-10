import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subject,
  Subscription,
  concatMap,
  filter,
  interval,
  takeUntil,
} from 'rxjs';
import { Piece } from '../models/piece.model';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  // ANCHOR : Properties
  public audioOn$ = new BehaviorSubject<boolean>(false);
  public timer$ = new BehaviorSubject<string>(this.formatTime(0));
  private _time = 0;

  public score: number = 0;
  public level: number = 1;
  public lines: number = 0;

  public gameOver$ = new BehaviorSubject<boolean>(false);
  public gameStart$ = new BehaviorSubject<boolean>(false);
  public maxScore: number;

  public currentPiece$ = new BehaviorSubject<Piece | undefined>(undefined);
  public nextPiece$ = new BehaviorSubject<Piece>(new Piece());

  public speed = 1;

  public isPaused$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    true
  );

  public cancelTimers$ = new Subject<void>();
  public cleanTable$ = new Subject<void>();

  public counter$: Observable<number> = this.isPaused$.pipe(
    filter((isPaused) => !isPaused),
    concatMap(() => interval(1000))
  );

  public downCounter$: Observable<number> = this.isPaused$.pipe(
    filter((isPaused) => !isPaused),
    concatMap(() => interval(1000 / this.speed))
  );

  private _subscriptions: Subscription[] = [];

  // ANCHOR : Constructor
  constructor() {
    const maxScoreStorage = Number(localStorage.getItem('maxScore'));
    this.maxScore = isNaN(maxScoreStorage) ? 0 : maxScoreStorage;

    this._createSubscriptions();
  }

  ngOnDestroy(): void {
    this._subscriptions.forEach((sub) => !sub.closed && sub.unsubscribe());
  }

  // ANCHOR : Methods

  private _createSubscriptions(): void {
    let subCounter = this._newSubCounter();
    let subDownCounter = this._newSubDownCounter();
    const subIsPaused = this.isPaused$.subscribe((isPaused) => {
      if (isPaused || this.gameOver$.value) {
        if (!subCounter.closed) subCounter.unsubscribe();
        if (!subDownCounter.closed) subDownCounter.unsubscribe();
      } else if (!isPaused) {
        this.cancelTimers$.next();
        subCounter = this._newSubCounter();
        subDownCounter = this._newSubDownCounter();
        this._subscriptions.push(subCounter, subDownCounter);
      }
    });

    const subGameOver = this.gameOver$.subscribe((gameOver) => {
      if (!gameOver) return;
      this.cancelTimers$.next();
      this.isPaused$.next(true);
      if (this.score > this.maxScore) {
        localStorage.setItem('maxScore', this.score.toString());
        this.maxScore = this.score;
      }
    });

    this._subscriptions.push(
      subCounter,
      subDownCounter,
      subIsPaused,
      subGameOver
    );
  }

  private _newSubCounter(): Subscription {
    const subCounter = this.counter$
      .pipe(takeUntil(this.cancelTimers$))
      .subscribe(() => {
        if (this.gameOver$.value) return;
        this._time++;
        this.timer$.next(this.formatTime(this._time));
      });
    return subCounter;
  }

  private _newSubDownCounter(): Subscription {
    const subDownCounter = this.downCounter$
      .pipe(takeUntil(this.cancelTimers$))
      .subscribe(() => {
        const currentPiece = this.currentPiece$.value;
        if (!currentPiece || this.gameOver$.value) return;
        currentPiece.position.y++;
        this.currentPiece$.next(currentPiece);
      });
    return subDownCounter;
  }

  public resetState(): void {
    if (this.score > this.maxScore) {
      localStorage.setItem('maxScore', this.score.toString());
      this.maxScore = this.score;
    }
    this._time = 0;
    this.timer$.next(this.formatTime(0));
    this.score = 0;
    this.level = 1;
    this.lines = 0;
    this.cleanTable$.next();
    this.gameOver$.next(false);
    this.gameStart$.next(false);
    this.isPaused$.next(true);
  }

  public startGame(): void {
    this.resetState();
    this.nextPiece$.next(new Piece());
    this.gameStart$.next(true);
    this.isPaused$.next(false);
  }

  public pauseGame(): void {
    this.isPaused$.next(!this.isPaused$.value);
  }

  public formatTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${
      seconds < 10 ? '0' : ''
    }${seconds}`;
  }
}
