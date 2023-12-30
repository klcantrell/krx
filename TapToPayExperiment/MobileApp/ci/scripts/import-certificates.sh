#!/bin/bash

set -euo pipefail

security create-keychain -p "" build.keychain
security set-keychain-settings # not sure what this does, but with additional parameters, can be used to set lock timeout. see https://github.com/Apple-Actions/import-codesign-certs/blob/5565bb656f60c98c8fc515f3444dd8db73545dc2/src/security.ts#L172-L178
security unlock-keychain -p "" build.keychain

echo $IOS_DIST_SIGNING_KEY | base64 --decode > signingCertificate.p12
security import signingCertificate.p12 \
                -f pkcs12 \
                -k build.keychain \
                -P $IOS_DIST_SIGNING_KEY_PASSWORD \
                -T /usr/bin/codesign

security set-key-partition-list -S apple-tool:,apple: -s -k "" build.keychain
security list-keychains -s build.keychain # triggers an update of the keychain list. see https://github.com/Apple-Actions/import-codesign-certs/blob/5565bb656f60c98c8fc515f3444dd8db73545dc2/src/security.ts#L50-L64
security default-keychain -s build.keychain # without this, build freezes waiting for a keychain password
