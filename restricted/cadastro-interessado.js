document.addEventListener("DOMContentLoaded", function () {
  let dataUltimoAcesso = getCookie("dataUltimoAcesso");
  let usuario = getCookie("usuarioLogado");
  if (dataUltimoAcesso && usuario) {
    $("#user-info").append(
      `<span>Olá ${usuario}, seu ultimo acesso foi em: ${dataUltimoAcesso}</span>`
    );
  }

  $("input").on("focus", function () {
    $(this).css("border-color", "#dee2e6");
    $("#error-message").css("display", "none");
  });

  function fetchTable() {
    fetch("/interessados/listar", { method: "get" })
      .then((r) => r.json())
      .then((r) => {
        let linhasTabela = "";

        if (r.data.length) {
          r.data.forEach((interessado) => {
            linhasTabela += `
                <tr>
                    <td>${interessado.name}</td>
                    <td>${interessado.email}</td>
                    <td>${interessado.phone}</td>
                </tr>
                `;
          });
        } else {
          linhasTabela +=
            '<tr><td colspan="3" class="text-center">Nenhum interessado cadastrado!</td></tr>';
        }

        $("#table-content").children().remove();
        $("#table-content").append(linhasTabela);
      });
  }

  fetchTable();

  $("#register-button").on("click", function () {
    let name = $("#name-input").val();
    let email = $("#email-input").val();
    let phone = $("#phone-input").val();

    const payload = { name, email, phone };

    fetch("/interessados/cadastrar", {
      method: "post",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((r) => r.json())
      .then((r) => {
        if (r.ok) {
          alert(r.message);
          fetchTable();
        } else {
          if (r.data) {
            validaCampos(r.data);
          }
          $("#error-message").css("display", "flex");
          $("#error-message").text(r.message);
        }
      });
  });
});

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2)
    return decodeURIComponent(parts.pop().split(";").shift());
}

function validaCampos(camposComErro) {
  camposComErro.forEach((campo) => {
    $(campo).css("border-color", "red");
  });
}
