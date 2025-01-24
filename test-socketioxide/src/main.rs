use hyper::server::conn::http1;
use hyper_util::rt::TokioIo;
use mimalloc::MiMalloc;
use rmpv::Value;
use socketioxide::{
    extract::{Data, SocketRef},
    SocketIo,
};
use std::net::SocketAddr;
use tokio::net::TcpListener;

#[global_allocator]
static GLOBAL: MiMalloc = MiMalloc;

fn on_connect(socket: SocketRef) {
    socket.on("message", |socket: SocketRef, Data::<Value>(data)| {
        socket.emit("message-back", &data).ok();
    });
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let (svc, io) = SocketIo::builder()
        .max_payload(10)
        .max_buffer_size(10)
        .build_svc();
    io.ns("/", on_connect);

    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    let listener = TcpListener::bind(addr).await?;

    // We start a loop to continuously accept incoming connections
    loop {
        let (stream, _) = listener.accept().await?;

        // Use an adapter to access something implementing `tokio::io` traits as if they implement
        // `hyper::rt` IO traits.
        let io = TokioIo::new(stream);
        let svc = svc.clone();

        // Spawn a tokio task to serve multiple connections concurrently
        tokio::task::spawn(async move {
            // Finally, we bind the incoming connection to our `hello` service
            if let Err(err) = http1::Builder::new()
                .serve_connection(io, svc)
                .with_upgrades()
                .await
            {
                println!("Error serving connection: {:?}", err);
            }
        });
    }
}
