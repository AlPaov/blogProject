from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers.home_routers import router as home_router
from routers.login_routers import router as login_router
from routers.post_routers import router as post_router
from routers.register_routers import router as register_router
from routers.settings_routers import router as settings_router
from routers.user_page_routers import router as user_page_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

routers = [register_router, login_router, home_router, post_router,
           user_page_router, settings_router]
for router in routers:
    app.include_router(router)



