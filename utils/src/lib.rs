use std::sync::LazyLock;
use jsonwebtoken::{decode, Algorithm, DecodingKey, Validation};
use hyper::header::HeaderValue;
use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct Claims {
    pub sub: String,
    pub exp: usize,
}

const DECODING_KEY: LazyLock<DecodingKey> = LazyLock::new(|| {
    DecodingKey::from_secret("test".as_ref())
});

// Do equivalent work to validating a real JWT token, but disregard the result
pub fn fake_validate_jwt_token(option: Option<&HeaderValue>) -> bool {
    if let Some(auth_header) = option {
        let auth_header = auth_header.to_str().unwrap();
        let bearer = auth_header.split_once("Bearer ").unwrap_or_default();
        match decode::<Claims>(bearer.1, &DECODING_KEY, &Validation::new(Algorithm::HS512)) {
            Ok(_) => {
                true
            }
            Err(_) => {
                // We should normally return a 401 Unauthorized here, but for the benchmark,
                // we just care about doing the work to see what load the system is under. To
                // not require JWTs during benchmarking, we allow this.
                true
            }
        }
    } else {
        false
    }
}
