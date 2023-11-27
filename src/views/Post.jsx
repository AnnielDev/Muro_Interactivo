import { useState, useEffect, useContext } from "react";
import PublicacionAPI from "../api/PublicacionAPI";
import { PuffLoader } from "react-spinners";
import { AuthContext } from "../context/AuthContext";
import { FaCheckCircle } from "react-icons/fa";
import "../assets/styles/post.css";
export function Post() {
  //VARIABLE GLOBAL
  const stateUser = useContext(AuthContext);
  //
  const [post, setPost] = useState({
    titulo: "",
    descripcion: "",
    file: null,
    usuario: null,
  });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fileUrl, setFileUrl] = useState(null);
  const [usuario, setUsuario] = useState(null);
  //
  useEffect(() => {
    setUsuario(JSON.stringify(stateUser.userLogged));
  }, [stateUser.userLogged]);
  //
  const addFile = (file) => {
    const url = URL.createObjectURL(file);
    setFileUrl(url);
    setPost({
      ...post,
      file: file,
    });
  };

  const crearPublicacion = async () => {
    try {
      if (!stateUser.isLoggedIn) {
        alert("No tiene usuario registrado!");
      } else {
        if (!post.titulo || !post.descripcion || post.file == null) {
          alert("Debe llenar todos los campos!");
        } else {
          const formData = new FormData();
          formData.append("titulo", post.titulo);
          formData.append("descripcion", post.descripcion);
          formData.append("file", post.file);
          formData.append("usuario", usuario);
          setLoading(true);
          await PublicacionAPI.crearPublicacion(formData).then((item) => {
            setPost({
              titulo: "",
              descripcion: "",
              file: null,
              usuario: null,
            });
            setMessage(item.message);
            setFileUrl(null);
            document.querySelector("#form").reset();
          });

          setLoading(false);
          setTimeout(() => {
            setMessage(null);
          }, 2000);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <form id="form" className="form" style={{ position: "relative" }}>
        {loading ? (
          <div className="loading">
            <div>
              <PuffLoader
                color="black"
                loading={loading}
                size={100}
                speedMultiplier={2}
              />
              <h3>Loading</h3>
            </div>
          </div>
        ) : message != null ? (
          <div className="loading">
            <div>
              <FaCheckCircle style={{ fontSize: "35px" }} />
              <h2>{message}</h2>
            </div>
          </div>
        ) : (
          ""
        )}
        <div>
          <div style={{ marginBottom: "10px" }}>
            <input
              type="file"
              id="imagen"
              className="inputfile"
              accept="image/*"
              onChange={(e) => {
                addFile(e.target.files[0]);
              }}
            />

            <label htmlFor="imagen" className="custom-file-input">
              Choose Image
            </label>
          </div>
          {fileUrl != null ? (
            <div
              style={{
                paddingTop: "10px",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              <img
                src={fileUrl}
                alt="file"
                style={{
                  borderRadius: "8px",
                  border: "2px solid black",
                  maxWidth: "50%",
                }}
              />
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="fields">
          <div>
            <input
              type="text"
              id="titulo"
              value={!post.titulo ? "" : post.titulo}
              maxLength={20}
              placeholder="title"
              onChange={(e) => {
                setPost({
                  ...post,
                  titulo: e.target.value,
                });
              }}
            />
          </div>
          <div>
            <textarea
              id="descripcion"
              value={!post.descripcion ? "" : post.descripcion}
              placeholder="description"
              onChange={(e) => {
                setPost({
                  ...post,
                  descripcion: e.target.value,
                });
              }}
            />
          </div>
        </div>
        <div>
          <button
            className="button_post"
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              crearPublicacion();
            }}
          >
            Publish
          </button>
        </div>
      </form>
    </div>
  );
}
