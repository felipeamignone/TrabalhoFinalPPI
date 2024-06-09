document.addEventListener("DOMContentLoaded", function () {
  $("input").on("focus", function () {
    $(this).css("border-color", "#dee2e6");
    $("#error-message").css("display", "none");
  });

  $("#login-button").on("click", function () {
    let user = $("#user-input").val();
    let senha = $("#senha-input").val();

    const payload = { user, senha };

    fetch("/login", {
      method: "post",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((r) => r.json())
      .then((r) => {
        if (r.ok) {
          alert(r.message);
          window.location.href = "/home";
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

function validaCampos(camposComErro) {
  camposComErro.forEach((campo) => {
    $(campo).css("border-color", "red");
  });
}


