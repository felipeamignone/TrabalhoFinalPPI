document.addEventListener("DOMContentLoaded", function () {
  let dataUltimoAcesso = getCookie("dataUltimoAcesso");
  let usuario = getCookie("usuarioLogado");
  if (dataUltimoAcesso && usuario) {
    $("#user-info").append(
      `<span>Olá ${usuario}, seu ultimo acesso foi em: ${dataUltimoAcesso}</span>`
    );
  }
});

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2)
    return decodeURIComponent(parts.pop().split(";").shift());
}
