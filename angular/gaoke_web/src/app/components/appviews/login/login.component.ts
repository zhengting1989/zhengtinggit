import {Component, OnInit} from '@angular/core';
import {LoginService} from './login.service';
import {Router} from '@angular/router';
import {Constants} from '../../../common/constants';
import {clearSessionStorage} from '../../../common/common.helpers';
import * as shajs from 'sha.js';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {ChooseUnificationComponent} from './choose.unification.component';
import {BsModalService} from 'ngx-bootstrap/modal';

@Component({
    selector: 'atnd-login',
    templateUrl: 'login.template.html',
    styleUrls: ['./login.template.scss']
})
export class LoginComponent implements OnInit {

    model: any = {
        username: '',
        password: ''
    };
    bsModalRef: BsModalRef;

    constructor(private loginService: LoginService,
                private router: Router,
                private modalService: BsModalService) {
        clearSessionStorage();
    }

    ngOnInit() {
        this.particleCanvas();
    }

    login() {
        const loginUser = {
            loginId: this.model.username,
            password: shajs('sha256').update(this.model.password).digest('hex')
        };
        let thisComponent = this;
        this.loginService.doLogin(loginUser, function (result) {
            sessionStorage.setItem(Constants.AUTH_KEY, JSON.stringify(result.token));
            if (result.platformUnificationInfos && result.platformUnificationInfos.length > 0) {
                const initialState = {
                    initialState: {
                        chooseUnifications: result.platformUnificationInfos
                    }
                };
                thisComponent.bsModalRef = thisComponent.modalService.show(ChooseUnificationComponent, initialState);
                thisComponent.bsModalRef.content.onChoose
                    .subscribe((formData) => {
                        thisComponent.loginService.againLogin(formData, function (againTokenResult) {
                            sessionStorage.setItem(Constants.AUTH_KEY, JSON.stringify(againTokenResult.token));
                            thisComponent.router.navigate(['starterview']);
                        })
                    });
            } else {
                thisComponent.router.navigate(['starterview']);
            }
        });
    }

    //粒子背景效果
    particleCanvas() {
        function o(w, v, i) {
            return w.getAttribute(v) || i;
        }

        function j(i) {
            return document.getElementsByTagName(i);
        }

        function l() {
            var i = j('script'),
                w = i.length,
                v = i[w - 1];
            return {
                l: w,
                z: o(v, 'zIndex', -1),
                o: o(v, 'opacity', 0.8),
                c: o(v, 'color', '243,243,244'),
                n: o(v, 'count', 120)
            };
        }

        function k() {
            (r = u.width =
                window.innerWidth ||
                document.documentElement.clientWidth ||
                document.body.clientWidth),
                (n = u.height =
                    window.innerHeight ||
                    document.documentElement.clientHeight ||
                    document.body.clientHeight);
        }

        function b() {
            e.clearRect(0, 0, r, n);
            var w = [f].concat(t);
            var x, v, A, B, z, y;
            t.forEach(function (i) {
                (i.x += i.xa),
                    (i.y += i.ya),
                    (i.xa *= i.x > r || i.x < 0 ? -1 : 1),
                    (i.ya *= i.y > n || i.y < 0 ? -1 : 1),
                    e.fillRect(i.x - 0.5, i.y - 0.5, 1, 1);
                for (v = 0; v < w.length; v++) {
                    x = w[v];
                    if (i !== x && null !== x.x && null !== x.y) {
                        (B = i.x - x.x), (z = i.y - x.y), (y = B * B + z * z);
                        y < x.max &&
                        (x === f &&
                        y >= x.max / 2 &&
                        ((i.x -= 0.05 * B), (i.y -= 0.05 * z)),
                            (A = (x.max - y) / x.max),
                            e.beginPath(),
                            (e.lineWidth = A),
                            // (e.lineWidth = A / 2),
                            (e.strokeStyle = 'rgba(' + s.c + ',' + (A + 0.5) + ')'),
                            e.moveTo(i.x, i.y),
                            e.lineTo(x.x, x.y),
                            e.stroke());
                    }
                }
                w.splice(w.indexOf(i), 1);
            }),
                m(b);
        }

        var u = document.createElement('canvas'),
            s = l(),
            c = 'c_n' + s.l,
            e = u.getContext('2d'),
            r,
            n,
            m =
                window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                function (i) {
                    window.setTimeout(i, 1000 / 45);
                },
            a = Math.random,
            f = {x: null, y: null, max: 20000};
        u.id = c;
        u.style.cssText = 'position:fixed;top:0;left:0;z-index:' + s.z + ';opacity:' + s.o;
        document.getElementById('loginPage').appendChild(u);
        k(), (window.onresize = k);
        (window.onmousemove = function (i: any) {
            (i = i || window.event), (f.x = i.clientX), (f.y = i.clientY);
        }),
            (window.onmouseout = function () {
                (f.x = null), (f.y = null);
            });
        for (var t = [], p = 0; s.n > p; p++) {
            var h = a() * r,
                g = a() * n,
                q = 2 * a() - 1,
                d = 2 * a() - 1;
            t.push({x: h, y: g, xa: q, ya: d, max: 6000});
        }
        setTimeout(function () {
            b();
        }, 100);
    }

}

