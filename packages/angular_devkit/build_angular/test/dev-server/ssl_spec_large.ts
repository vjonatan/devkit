/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { tags } from '@angular-devkit/core';
import { from } from 'rxjs';
import { concatMap, take, tap } from 'rxjs/operators';
import { DevServerBuilderOptions } from '../../src';
import { devServerTargetSpec, host, request, runTargetSpec } from '../utils';


describe('Dev Server Builder ssl', () => {
  beforeEach(done => host.initialize().subscribe(undefined, done.fail, done));
  afterEach(done => host.restore().subscribe(undefined, done.fail, done));

  it('works', (done) => {
    const overrides: Partial<DevServerBuilderOptions> = { ssl: true };

    runTargetSpec(host, devServerTargetSpec, overrides).pipe(
      tap((buildEvent) => expect(buildEvent.success).toBe(true)),
      concatMap(() => from(request('https://localhost:4200/index.html'))),
      tap(response => expect(response).toContain('<title>HelloWorldApp</title>')),
      take(1),
    ).subscribe(undefined, done.fail, done);
  }, 30000);

  it('supports key and cert', (done) => {
    host.writeMultipleFiles({
      'ssl/server.key': tags.stripIndents`
        -----BEGIN RSA PRIVATE KEY-----
        MIIEpAIBAAKCAQEA0+kOHdfpsPNUguCtai27DJ+DuOfVw4gw1P3BgYhNG8qoukaW
        gdDLowj59+cXXgn9ZnQ8PdvZXhCEQcP3wjd1cBPuGQzO7BekoKEgzfGE/zjrrIeL
        Q7tHYx9ddCPotQX4OJu4FZFJyS1Ar7zDDpQ9fSw6qmsXWN6I18fIGSVvbDbVB9rw
        iAsLGe2jWadjXAjSqVOy6aT+CKJgnRnxudNZGP1LRC1YDRl/s7icCIh/9gEGfn7G
        gwQQ9AM2p3JNjP2quclSjBvMv0uVj+yzL2bPGRz0hu90CDaIEU2FtBCse50/O75q
        x0bQnPbuHKD3ajs0DfQYoAmFZGK078ZDl/VQxwIDAQABAoIBAEl17kXcNo/4GqDw
        QE2hoslCdwhfnhQVn1AG09ESriBnRcylccF4308aaoVM4CXicqzUuJl9IEJimWav
        B7GVRinfTtfyP71KiPCCSvv5sPBFDDYYGugVAS9UjTIYzLAMbLs7CDq5zglmnZkO
        Z9QjAZnl/kRbsZFGO8wJ3s0Q1Cp/ygZcvFU331K2jHXW7B4YXiFOH/lBQrjdz0Gy
        WBjX4zIdNWnwarvxu46IS/0z1P1YOHM8+B1Uv54MG94A6szBdd/Vp0cQRs78t/Cu
        BQ1Rnuk16Pi+ieC5K04yUgeuNusYW0PWLtPX1nKNp9z46bmD1NHKAxaoDFXr7qP3
        pZCaDMkCgYEA8mmTYrhXJTRIrOxoUwM1e3OZ0uOxVXJJ8HF6X8t+UO6dFxXB/JC9
        ZBc+94cZQapaKFOeMmd/j3L2CQIjChk5yKV/G3Io+raxIoAAKPCkMF4NQQVvvNkS
        CAGl61Qa78DoF5Habumz0AC1R9P877kNTC0aPSt4lhPWgfotbZNNMlMCgYEA38nM
        s4a0pZseXPkuOtPYX/3Ms3E+d70XKSFuIMCHCg79YGsQ8h/9apYcPyeYkpQ0a4gs
        I3IUqMaXC2OyqWA5LU1BZv51mXb6zcb2pokZfpiSWk+7sy5XjkE9EmQxp3xHfV3c
        EO/DxHfWNvtMjESMbhu0yVzM2O/Aa53Tl9lqAT0CgYEA1dXBuHyqCtyTG08zO78B
        55Ny5rAJ1zkI9jvz2hr0o0nJcvqzcyruliNXXRxkcCNoglg4nXfk81JSrGGhLSBR
        c6hhdoF+mqKboLZO7c5Q14WvpWK5TVoiaMOja/J2DHYbhecYS2yGPH7TargaUBDq
        JP9IPRtitOhs+Z0Jg7ZDi5cCgYAMb7B6gY/kbBxh2k8hYchyfS41AqQQD2gMFxmB
        pHFcs7yM8SY97l0s4S6sq8ykyKupFiYtyhcv0elu7pltJDXJOLPbv2RVpPEHInlu
        g8vw5xWrAydRK9Adza5RKVRBFHz8kIy8PDbK4kX7RDfay6xqKgv/7LJNk/VDhb/O
        fnyPmQKBgQDg/o8Ubf/gxA9Husnuld4DBu3wwFhkMlWqyO9QH3cKgojQ2JGSrfDz
        xHhetmhionEyzg0JCaMSpzgIHY+8o/NAwc++OjNHEoYp3XWM9GTp81ROMz6b83jV
        biVR9N0MhONdwF6vtzDCcJxNIUe2p4lTvLf/Xd9jaQDNXe35Gxsdyg==
        -----END RSA PRIVATE KEY-----
      `,
      'ssl/server.crt': tags.stripIndents`
        -----BEGIN CERTIFICATE-----
        MIID5jCCAs6gAwIBAgIJAJOebwfGCm61MA0GCSqGSIb3DQEBBQUAMFUxCzAJBgNV
        BAYTAlVTMRAwDgYDVQQIEwdHZW9yZ2lhMRAwDgYDVQQHEwdBdGxhbnRhMRAwDgYD
        VQQKEwdBbmd1bGFyMRAwDgYDVQQLEwdBbmd1bGFyMB4XDTE2MTAwNDAxMDAyMVoX
        DTI2MTAwMjAxMDAyMVowVTELMAkGA1UEBhMCVVMxEDAOBgNVBAgTB0dlb3JnaWEx
        EDAOBgNVBAcTB0F0bGFudGExEDAOBgNVBAoTB0FuZ3VsYXIxEDAOBgNVBAsTB0Fu
        Z3VsYXIwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDT6Q4d1+mw81SC
        4K1qLbsMn4O459XDiDDU/cGBiE0byqi6RpaB0MujCPn35xdeCf1mdDw929leEIRB
        w/fCN3VwE+4ZDM7sF6SgoSDN8YT/OOush4tDu0djH110I+i1Bfg4m7gVkUnJLUCv
        vMMOlD19LDqqaxdY3ojXx8gZJW9sNtUH2vCICwsZ7aNZp2NcCNKpU7LppP4IomCd
        GfG501kY/UtELVgNGX+zuJwIiH/2AQZ+fsaDBBD0Azanck2M/aq5yVKMG8y/S5WP
        7LMvZs8ZHPSG73QINogRTYW0EKx7nT87vmrHRtCc9u4coPdqOzQN9BigCYVkYrTv
        xkOX9VDHAgMBAAGjgbgwgbUwHQYDVR0OBBYEFG4VV6/aNLx/qFIS9MhAWuyeV5OX
        MIGFBgNVHSMEfjB8gBRuFVev2jS8f6hSEvTIQFrsnleTl6FZpFcwVTELMAkGA1UE
        BhMCVVMxEDAOBgNVBAgTB0dlb3JnaWExEDAOBgNVBAcTB0F0bGFudGExEDAOBgNV
        BAoTB0FuZ3VsYXIxEDAOBgNVBAsTB0FuZ3VsYXKCCQCTnm8HxgputTAMBgNVHRME
        BTADAQH/MA0GCSqGSIb3DQEBBQUAA4IBAQDO4jZT/oKVxaiWr+jV5TD+qwThl9zT
        Uw/ZpFDkdbZdY/baCFaLCiJwkK9+puMOabLvm1VzcnHHWCoiUNbWpw8AOumLEnTv
        ze/5OZXJ6XlA9kd9f3hDlN5zNB3S+Z2nKIrkPGfxQZ603QCbWaptip5dxgek6oDZ
        YXVtnbOnPznRsG5jh07U49RO8CNebqZLzdRToLgObbqYlfRMcbUxCOHXjnB5wUlp
        377Iivm4ldnCTvFOjEiDh+FByWL5xic7PjyJPZFMidiYTmsGilP9XTFC83CRZwz7
        vW+RCSlU6x8Uejz98BPmASoqCuCTUeOo+2pFelFhX9NwR/Sb6b7ybdPv
        -----END CERTIFICATE-----
      `,
    });

    const overrides: Partial<DevServerBuilderOptions> = {
      ssl: true,
      sslKey: '../ssl/server.key',
      sslCert: '../ssl/server.crt',
    };

    runTargetSpec(host, devServerTargetSpec, overrides).pipe(
      tap((buildEvent) => expect(buildEvent.success).toBe(true)),
      concatMap(() => from(request('https://localhost:4200/index.html'))),
      tap(response => expect(response).toContain('<title>HelloWorldApp</title>')),
      take(1),
    ).subscribe(undefined, done.fail, done);
  }, 30000);
});
