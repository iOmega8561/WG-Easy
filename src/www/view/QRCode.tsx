import Props from "../data/Props";

const QRCode: React.FC<Props.QRCode> = ({
  clientId
}) => {

  return (
    <div className="modal-container">
      <div className="modal-content">
        <img src={`/api/wireguard/client/${clientId}/qrcode.svg`}/>
      </div>
    </div>
  )
}

export default QRCode;